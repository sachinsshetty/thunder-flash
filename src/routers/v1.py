# routers/v1.py
from fastapi import APIRouter, File, UploadFile, Form, Query, Header, HTTPException, Depends, status
from typing import Optional
from datetime import datetime
from sqlalchemy.orm import Session
from typing import List
from models import (
    ChatRequest, ChatResponse, VisualQueryResponse, ExtractTextResponse, PdfSummaryResponse
)
from routers.core import upload_image_query_endpoint
from config import DEFAULT_SYSTEM_PROMPT
from database import get_db, UserCapture
from schemas import UserCaptureCreate, UserCaptureUpdate, UserCaptureResponse
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/v1", tags=["v1"])

@router.get("/user-captures/", response_model=List[UserCaptureResponse])
def read_user_captures(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """
    Retrieve a paginated list of user captures.
    """
    try:
        captures = db.query(UserCapture).offset(skip).limit(limit).all()
        logger.info(f"Retrieved {len(captures)} user captures.")
        return captures
    except Exception as e:
        logger.error(f"Error retrieving user captures: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.get("/user-captures/by-user/{user_id}", response_model=UserCaptureResponse)
def read_user_capture_by_user_id(user_id: str, db: Session = Depends(get_db)):
    """
    Retrieve a specific user capture by user_id.
    """
    try:
        capture = db.query(UserCapture).filter(UserCapture.user_id == user_id).first()
        if capture is None:
            raise HTTPException(status_code=404, detail="User capture not found")
        return capture
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error retrieving user capture for user_id {user_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.get("/user-captures/{capture_id}", response_model=UserCaptureResponse)
def read_user_capture_by_capture_id(capture_id: int, db: Session = Depends(get_db)):
    """
    Retrieve a specific user capture by capture_id.
    """
    try:
        capture = db.query(UserCapture).filter(UserCapture.id == capture_id).first()
        if capture is None:
            raise HTTPException(status_code=404, detail="User capture not found")
        return capture
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error retrieving user capture for capture_id {capture_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.post("/user-captures/", response_model=UserCaptureResponse, status_code=status.HTTP_201_CREATED)
def create_user_capture(capture_create: UserCaptureCreate, db: Session = Depends(get_db)):
    """
    Create a new user capture.
    """
    try:
        # Check if user_id already exists (enforce uniqueness)
        existing = db.query(UserCapture).filter(UserCapture.user_id == capture_create.user_id).first()
        if existing:
            raise HTTPException(status_code=409, detail="User capture for this user_id already exists")
        
        db_capture = UserCapture(**capture_create.dict())
        db.add(db_capture)
        db.commit()
        db.refresh(db_capture)
        logger.info(f"Created user capture for user_id {capture_create.user_id}")
        return db_capture
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        logger.error(f"Error creating user capture: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.put("/user-captures/{capture_id}", response_model=UserCaptureResponse)
def update_user_capture(capture_id: int, capture_update: UserCaptureUpdate, db: Session = Depends(get_db)):
    """
    Update an existing user capture by ID.
    """
    try:
        db_capture = db.query(UserCapture).filter(UserCapture.id == capture_id).first()
        if db_capture is None:
            raise HTTPException(status_code=404, detail="User capture not found")
        
        update_data = capture_update.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_capture, field, value)
        
        db.commit()
        db.refresh(db_capture)
        logger.info(f"Updated user capture ID {capture_id}")
        return db_capture
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        logger.error(f"Error updating user capture ID {capture_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")
    
@router.get("/user-captures/time-range/", response_model=List[UserCaptureResponse])
def read_user_captures_by_time_range(
    start_time: datetime,
    end_time: datetime,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """
    Retrieve a paginated list of user captures within a specified time range.
    start_time and end_time should be in ISO 8601 format (e.g., 2025-11-14T00:00:00).
    """
    try:
        if start_time > end_time:
            raise HTTPException(status_code=400, detail="start_time must be before end_time")
        
        query = db.query(UserCapture).filter(
            UserCapture.created_at >= start_time,
            UserCapture.created_at <= end_time
        )
        captures = query.offset(skip).limit(limit).all()
        logger.info(f"Retrieved {len(captures)} user captures from {start_time} to {end_time}.")
        return captures
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error retrieving user captures by time range: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.delete("/user-captures/{capture_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user_capture(capture_id: int, db: Session = Depends(get_db)):
    """
    Delete a user capture by ID.
    """
    try:
        db_capture = db.query(UserCapture).filter(UserCapture.id == capture_id).first()
        if db_capture is None:
            raise HTTPException(status_code=404, detail="User capture not found")
        
        db.delete(db_capture)
        db.commit()
        logger.info(f"Deleted user capture ID {capture_id}")
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        logger.error(f"Error deleting user capture ID {capture_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.post("/indic_chat", response_model=ChatResponse)
async def indic_chat_endpoint(chat_request: ChatRequest, api_key: Optional[str] = Header(None)):
    """Handle chat requests (dummy implementation)."""
    # In production, validate api_key and integrate real chat logic
    return ChatResponse(
        response=f"Response to: {chat_request.message}",
        session_id=chat_request.session_id or "dummy_session"
    )

@router.post("/indic_visual_query", response_model=VisualQueryResponse)
async def indic_visual_query_endpoint(
    file: UploadFile = File(...),
    query: str = Form(...),
    src_lang: str = Query("eng_Latn"),
    tgt_lang: str = Query("eng_Latn"),
    api_key: Optional[str] = Header(None),
    db: Session = Depends(get_db)
):
    """Handle visual queries via image upload."""
    # In production, validate api_key
    # Pass system_prompt explicitly when calling internally
    # Note: upload_image_query_endpoint now requires db, but since it's async and Depends, it should work
    response_content = await upload_image_query_endpoint(
        text=query, 
        system_prompt=DEFAULT_SYSTEM_PROMPT, 
        lat=52.5200,  # Default lat
        lon=13.4050,  # Default lon
        file=file,
        db=db
    )
    return VisualQueryResponse(
        answer=response_content["response"],
        src_lang=src_lang,
        tgt_lang=tgt_lang
    )

@router.post("/extract-text", response_model=ExtractTextResponse)
async def extract_text_endpoint(
    file: UploadFile = File(...),
    page_number: int = Query(...),
    language: str = Query(...),
    api_key: Optional[str] = Header(None)
):
    """Extract text from a specific PDF page (dummy implementation)."""
    # In production, integrate real PDF extraction logic (e.g., using PyMuPDF or pdfplumber)
    content = await file.read()
    decoded_content = content[:200].decode('utf-8', errors='ignore')  # Limit for demo
    return ExtractTextResponse(
        extracted_text=f"Extracted from page {page_number}: {decoded_content}...",
        page_number=page_number,
        language=language
    )

@router.post("/indic-summarize-pdf-all", response_model=PdfSummaryResponse)
async def indic_summarize_pdf_endpoint(
    file: UploadFile = File(...),
    tgt_lang: str = Form(...),
    model: str = Form(...),
    api_key: Optional[str] = Header(None)
):
    """Summarize entire PDF (dummy implementation)."""
    # In production, integrate real PDF summarization (e.g., extract all pages and use LLM)
    return PdfSummaryResponse(
        summary="Dummy PDF summary in target language.",
        tgt_lang=tgt_lang,
        model=model
    )