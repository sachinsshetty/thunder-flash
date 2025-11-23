# routers/core.py
from fastapi import APIRouter, HTTPException, File, UploadFile, Form, Depends
from fastapi.responses import JSONResponse
from typing import Optional
import base64
import uuid
import re
import json
from datetime import datetime
from sqlalchemy.orm import Session

# Your existing imports
from models import TextQueryRequest, ImageQueryRequest
from clients import client
from config import DEFAULT_SYSTEM_PROMPT
from database import get_db, UserCapture
from schemas import UserCaptureCreate

router = APIRouter(prefix="", tags=["core"])


# ========================================
# 1. Original Endpoints (unchanged)
# ========================================

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

        user_id = str(uuid.uuid4())
        capture_create = UserCaptureCreate(
            user_id=user_id,
            query_text=text,
            image=image_url,
            latitude=lat,
            longitude=lon,
            ai_response=ai_response
        )

        db_capture = UserCapture(**capture_create.dict())
        db.add(db_capture)
        db.commit()
        db.refresh(db_capture)

        return {"response": ai_response, "capture_id": db_capture.id}

    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))


# ========================================
# 2. NEW: Lawn Care Analyzer (NO STORAGE)
# ========================================

@router.post(
    "/analyze-lawn",
    response_class=JSONResponse,
    summary="Upload lawn photo → get detailed structured JSON plan (no data stored)",
    description="Two-step vision pipeline using GPT-4o or similar. Returns clean JSON only."
)
async def analyze_lawn(
    file: UploadFile = File(..., description="Photo of your lawn or garden")
):
    """
    Two-step process:
    1. Generate accurate factual description of the image
    2. Generate full structured lawn restoration plan in JSON
    → Nothing is saved to the database
    """
    # Validate file
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Uploaded file must be an image")

    # Read and encode image
    image_bytes = await file.read()
    b64_image = base64.b64encode(image_bytes).decode("utf-8")
    data_url = f"data:{file.content_type};base64,{b64_image}"

    model = "gemma3"
    # === STEP 1: Get precise description ===
    desc_messages = [
        {
            "role": "system",
            "content": (
                "You are an expert visual analyst for gardens and lawns. "
                "Describe the attached photo in 2–4 clear, factual sentences only. "
                "Include: lawn size/shape, grass condition, bare patches, debris, weeds, moss, "
                "slopes, fencing, structures, season clues (leaves, light, shadows), and any visible issues. "
                "Do NOT give advice, opinions, or suggestions — only describe what you see."
            )
        },
        {
            "role": "user",
            "content": [{"type": "image_url", "image_url": {"url": data_url}}]
        }
    ]

    desc_response = client.chat.completions.create(
        model=model,
        messages=desc_messages,
        max_tokens=500,
        temperature=0.0
    )
    description = desc_response.choices[0].message.content.strip().strip('"')

    # === STEP 2: Generate full structured plan ===
    plan_messages = [
        {
            "role": "system",
            "content": (
                "You are an expert horticulturist and lawn-care specialist. "
                "Always respond with valid JSON only using the exact structure below. "
                "Never include markdown, explanations, or extra text."
            )
        },
        {
            "role": "user",
            "content": [
                {"type": "text", "text": f"""
The photo shows: {description}

Assume late autumn/early winter (November) and temperate climate (cool-season grasses) unless the image clearly shows otherwise.

Return ONLY this JSON structure:

{{
  "overall_assessment": "One-paragraph summary of the current lawn condition",
  "recommended_actions": [
    {{
      "step_number": 1,
      "title": "Short descriptive title",
      "why": "Why this step is important",
      "how_to_do_it": "Clear step-by-step instructions",
      "tools_and_materials": ["list", "of", "required", "items"],
      "best_timing": "When to perform this action",
      "notes": "Optional extra tips or warnings (or null)"
    }}
  ],
  "ongoing_maintenance": "Brief summary of regular care needed"
}}
                """},
                {"type": "image_url", "image_url": {"url": data_url}}
            ]
        }
    ]

    plan_response = client.chat.completions.create(
        model=model,
        messages=plan_messages,
        max_tokens=2000,
        temperature=0.3
    )

    raw_output = plan_response.choices[0].message.content

    # Extract JSON block
    json_match = re.search(r"\{.*\}", raw_output, re.DOTALL)
    if not json_match:
        raise HTTPException(status_code=500, detail="Model failed to return valid JSON")

    try:
        final_plan = json.loads(json_match.group(0))
    except json.JSONDecodeError as e:
        raise HTTPException(status_code=500, detail=f"Invalid JSON from model: {str(e)}")

    return JSONResponse(content=final_plan)