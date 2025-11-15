# routers/core.py
from fastapi import APIRouter, HTTPException, File, UploadFile, Form, Query, Depends
from typing import Optional
import base64
import uuid
from datetime import datetime
from sqlalchemy.orm import Session

from models import TextQueryRequest, ImageQueryRequest
from clients import client
from config import DEFAULT_SYSTEM_PROMPT

from database import get_db, UserCapture
from schemas import UserCaptureCreate

router = APIRouter(prefix="", tags=["core"])

@router.post("/text_query")
async def text_query_endpoint(request: TextQueryRequest):
    """Handle text-based queries for weapon identification."""
    try:
        user_prompt = "identify the weapon :" + request.prompt
        messages = [{"role": "user", "content": user_prompt}]
        if request.system_prompt.strip():
            messages.insert(0, {"role": "system", "content": request.system_prompt})
        
        response = client.chat.completions.create(
            model="gemma3",
            messages=messages,
        )
        return {"response": response.choices[0].message.content}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/image_query")
async def image_query_endpoint(request: ImageQueryRequest):
    """Handle image-based queries via URL."""
    try:
        if not (request.image_url.startswith("http") or request.image_url.startswith("data:")):
            raise HTTPException(status_code=400, detail="image_url must be a valid HTTP URL or base64 data URL")

        messages = [
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": request.text},
                    {"type": "image_url", "image_url": {"url": request.image_url}},
                ],
            }
        ]

        kwargs = {"model": "gemma3", "messages": messages}

        response = client.chat.completions.create(**kwargs)
        return {"response": response.choices[0].message.content}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/upload_image_query")
async def upload_image_query_endpoint(
    text: str = Form(...),
    system_prompt: str = Form(DEFAULT_SYSTEM_PROMPT),
    lat: float = Form(52.5200),
    lon: float = Form(13.4050),
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    """Handle image upload and query with optional system prompt and GPS coordinates."""
    try:
        if not file.content_type.startswith("image/"):
            raise HTTPException(status_code=400, detail="File must be an image")

        contents = await file.read()
        base64_image = base64.b64encode(contents).decode('utf-8')
        image_url = f"data:{file.content_type};base64,{base64_image}"

        messages = [
            {"role": "system", "content": system_prompt},
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": text},
                    {"type": "image_url", "image_url": {"url": image_url}},
                ],
            }
        ]

        kwargs = {"model": "gemma3", "messages": messages}

        print(f"{text} (Location: {lat}, {lon})")
        response = client.chat.completions.create(**kwargs)
        ai_response = response.choices[0].message.content

        # Generate a unique user_id for this capture
        user_id = str(uuid.uuid4())

        # Prepare data for UserCapture insertion
        capture_create = UserCaptureCreate(
            user_id=user_id,
            query_text=text,
            image=image_url,  # Store base64 image URL
            latitude=lat,
            longitude=lon,
            ai_response=ai_response
            # created_at auto-generated
        )

        # Check for existing (though unlikely with UUID)
        existing = db.query(UserCapture).filter(UserCapture.user_id == user_id).first()
        if existing:
            raise HTTPException(status_code=409, detail="User capture already exists (unlikely with UUID)")

        # Insert into database
        db_capture = UserCapture(**capture_create.dict())
        db.add(db_capture)
        db.commit()
        db.refresh(db_capture)

        # Return the AI response (you could also include the capture ID if needed)
        return {"response": ai_response, "capture_id": db_capture.id}

    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))