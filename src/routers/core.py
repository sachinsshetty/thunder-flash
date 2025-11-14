# routers/core.py
from fastapi import APIRouter, HTTPException, File, UploadFile, Form, Query
from typing import Optional
import base64

from models import TextQueryRequest, ImageQueryRequest
from clients import client
from config import DEFAULT_SYSTEM_PROMPT

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
    file: UploadFile = File(...)
):
    """Handle image upload and query with optional system prompt."""
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

        response = client.chat.completions.create(**kwargs)
        return {"response": response.choices[0].message.content}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))