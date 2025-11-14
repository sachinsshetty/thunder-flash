# models.py
from pydantic import BaseModel
from typing import Optional
from config import DEFAULT_SYSTEM_PROMPT

class TextQueryRequest(BaseModel):
    prompt: str
    system_prompt: str = DEFAULT_SYSTEM_PROMPT

class ImageQueryRequest(BaseModel):
    text: str
    image_url: str  # HTTP URL or base64 data URL
    max_tokens: Optional[int] = None

class ChatRequest(BaseModel):
    message: str
    session_id: Optional[str] = None

class ChatResponse(BaseModel):
    response: str
    session_id: str

class VisualQueryResponse(BaseModel):
    answer: str
    src_lang: str
    tgt_lang: str

class ExtractTextResponse(BaseModel):
    extracted_text: str
    page_number: int
    language: str

class PdfSummaryResponse(BaseModel):
    summary: str
    tgt_lang: str
    model: str