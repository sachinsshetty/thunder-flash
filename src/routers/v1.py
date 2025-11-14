# routers/v1.py
from fastapi import APIRouter, File, UploadFile, Form, Query, Header, HTTPException
from typing import Optional

from models import (
    ChatRequest, ChatResponse, VisualQueryResponse, ExtractTextResponse, PdfSummaryResponse
)
from routers.core import upload_image_query_endpoint
from config import DEFAULT_SYSTEM_PROMPT

router = APIRouter(prefix="/v1", tags=["v1"])

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
    api_key: Optional[str] = Header(None)
):
    """Handle visual queries via image upload."""
    # In production, validate api_key
    # Pass system_prompt explicitly when calling internally
    response_content = await upload_image_query_endpoint(
        text=query, 
        system_prompt=DEFAULT_SYSTEM_PROMPT, 
        file=file
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