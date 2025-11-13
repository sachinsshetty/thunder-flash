from fastapi import FastAPI, HTTPException, File, UploadFile, Form
from pydantic import BaseModel
from openai import OpenAI
import base64
import os
from typing import Optional

app = FastAPI(title="OpenAI Query Endpoints", description="Endpoints for text and image queries using OpenAI API")

# Initialize OpenAI client (use environment variables for security in production)
API_KEY = os.getenv("DWANI_API_KEY", "your-api-key-here")
BASE_URL = os.getenv("DWANI_BASE_URL", "https://your-custom-endpoint.com/v1")

client = OpenAI(
    api_key=API_KEY,
    base_url=BASE_URL
)

class TextQueryRequest(BaseModel):
    model: str = "gemma3                                                                                                                                                                                                                                                                       "
    prompt: str
    max_tokens: Optional[int] = 300

class ImageQueryRequest(BaseModel):
    model: str = "gemma3"
    text: str
    image_url: str  # Can be HTTP URL or base64 data URL like "data:image/jpeg;base64,{base64_data}"
    max_tokens: Optional[int] = 300

@app.post("/text_query")
async def text_query(request: TextQueryRequest):
    try:
        response = client.chat.completions.create(
            model=request.model,
            messages=[{"role": "user", "content": request.prompt}],
            max_tokens=request.max_tokens,
        )
        return {"response": response.choices[0].message.content}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/image_query")
async def image_query(request: ImageQueryRequest):
    try:
        # Validate if it's a base64 data URL or regular URL
        if not (request.image_url.startswith("http") or request.image_url.startswith("data:")):
            raise HTTPException(status_code=400, detail="image_url must be a valid HTTP URL or base64 data URL")

        response = client.chat.completions.create(
            model=request.model,
            messages=[
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": request.text},
                        {
                            "type": "image_url",
                            "image_url": {"url": request.image_url},
                        },
                    ],
                }
            ],
            max_tokens=request.max_tokens,
        )
        return {"response": response.choices[0].message.content}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Optional: Function to encode local image to base64 (can be called separately or integrated)
def encode_image(image_path: str) -> str:
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode('utf-8')


@app.post("/upload_image_query")
async def upload_image_query(
    model: str = Form("gemma3"),
    text: str = Form(...),
    file: UploadFile = File(...),
    max_tokens: Optional[int] = Form(300)
):
    try:
        # Validate file is an image
        if not file.content_type.startswith("image/"):
            raise HTTPException(status_code=400, detail="File must be an image")

        # Read and encode the image to base64
        contents = await file.read()
        base64_image = base64.b64encode(contents).decode('utf-8')
        image_url = f"data:{file.content_type};base64,{base64_image}"

        response = client.chat.completions.create(
            model=model,
            messages=[
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": text},
                        {
                            "type": "image_url",
                            "image_url": {"url": image_url},
                        },
                    ],
                }
            ],
            max_tokens=max_tokens,
        )
        return {"response": response.choices[0].message.content}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

from fastapi import FastAPI, UploadFile, File, Form, Query, Header, HTTPException, Response
from fastapi.responses import StreamingResponse, FileResponse
from pydantic import BaseModel
from typing import Optional, Dict, Any
import io
import uvicorn


class LoginRequest(BaseModel):
    username: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    expires_in: int

class RegisterRequest(BaseModel):
    app_name: str
    # Add other fields as needed

class TranscriptionResponse(BaseModel):
    transcription: str
    language: str

class ChatRequest(BaseModel):
    message: str
    session_id: Optional[str] = None

class ChatResponse(BaseModel):
    response: str
    session_id: str

class TranslationRequest(BaseModel):
    text: str
    source_lang: str
    target_lang: str

class TranslationResponse(BaseModel):
    translated_text: str
    source_lang: str
    target_lang: str

class VisualQueryResponse(BaseModel):
    query_result: str
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

# Dummy binary data for TTS and SpeechToSpeech (in real impl, generate actual audio)
DUMMY_AUDIO = b"dummy audio bytes"

# API Key validation (placeholder - in real impl, validate against a secret)
def validate_api_key(api_key: str = Header(None)) -> str:
    if not api_key or api_key != "your-secret-api-key":  # Replace with actual validation
        raise HTTPException(status_code=401, detail="Invalid API Key")
    return api_key

@app.post("/v1/token", response_model=TokenResponse)
async def login(login_request: LoginRequest, api_key: str = Header(None)):
    validate_api_key(api_key)
    # Dummy login logic
    return TokenResponse(
        access_token="dummy_token",
        token_type="bearer",
        expires_in=3600
    )

@app.post("/v1/app/register", response_model=TokenResponse)
async def app_register(register_request: RegisterRequest, api_key: str = Header(None)):
    validate_api_key(api_key)
    # Dummy register logic
    return TokenResponse(
        access_token="dummy_app_token",
        token_type="bearer",
        expires_in=3600
    )

@app.post("/v1/transcribe/", response_model=TranscriptionResponse)
async def transcribe_audio(
    audio: UploadFile = File(...),
    language: str = Query(...),
    api_key: str = Header(None)
):
    validate_api_key(api_key)
    # Dummy transcription - read file content
    content = await audio.read()
    return TranscriptionResponse(
        transcription=f"Transcribed: {content[:100].decode('utf-8', errors='ignore')}...",
        language=language
    )

@app.post("/v1/indic_chat", response_model=ChatResponse)
async def chat(chat_request: ChatRequest, api_key: str = Header(None)):
    validate_api_key(api_key)
    # Dummy chat logic
    return ChatResponse(
        response=f"Response to: {chat_request.message}",
        session_id="dummy_session"
    )

@app.post("/v1/audio/speech")
async def text_to_speech(
    input_text: str = Query(...),
    language: str = Query(...),
    api_key: str = Header(None)
):
    validate_api_key(api_key)
    # Dummy TTS - return dummy audio
    return StreamingResponse(
        io.BytesIO(DUMMY_AUDIO),
        media_type="audio/wav",
        headers={"Content-Disposition": "attachment; filename=tts.wav"}
    )

@app.post("/v1/translate", response_model=TranslationResponse)
async def translate(translation_request: TranslationRequest, api_key: str = Header(None)):
    validate_api_key(api_key)
    # Dummy translation
    return TranslationResponse(
        translated_text=f"Translated: {translation_request.text}",
        source_lang=translation_request.source_lang,
        target_lang=translation_request.target_lang
    )

@app.post("/v1/indic_visual_query", response_model=VisualQueryResponse)
async def visual_query(
    file: UploadFile = File(...),
    query: str = Form(...),
    src_lang: str = Query(...),
    tgt_lang: str = Query(...),
    api_key: str = Header(None)
):
    validate_api_key(api_key)
    # Dummy visual query
    content = await file.read()
    return VisualQueryResponse(
        query_result=f"Visual query result for: {query}",
        src_lang=src_lang,
        tgt_lang=tgt_lang
    )

@app.post("/v1/speech_to_speech")
async def speech_to_speech(
    language: str = Query(...),
    file: UploadFile = File(...),
    api_key: str = Header(None)
):
    validate_api_key(api_key)
    # Dummy speech to speech
    return StreamingResponse(
        io.BytesIO(DUMMY_AUDIO),
        media_type="audio/wav",
        headers={"Content-Disposition": "attachment; filename=stt.wav"}
    )

@app.post("/v1/extract-text", response_model=ExtractTextResponse)
async def extract_text(
    file: UploadFile = File(...),
    page_number: int = Query(...),
    language: str = Query(...),
    api_key: str = Header(None)
):
    validate_api_key(api_key)
    # Dummy text extraction
    content = await file.read()
    return ExtractTextResponse(
        extracted_text=f"Extracted from page {page_number}: {content[:100].decode('utf-8', errors='ignore')}...",
        page_number=page_number,
        language=language
    )

@app.post("/v1/indic-summarize-pdf-all", response_model=PdfSummaryResponse)
async def summarize_pdf(
    file: UploadFile = File(...),
    tgt_lang: str = Form(...),
    model: str = Form(...),
    api_key: str = Header(None)
):
    validate_api_key(api_key)
    # Dummy PDF summary
    return PdfSummaryResponse(
        summary="Dummy PDF summary",
        tgt_lang=tgt_lang,
        model=model
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)