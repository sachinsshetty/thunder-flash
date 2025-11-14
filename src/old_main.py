from fastapi import FastAPI, HTTPException, File, UploadFile, Form
from pydantic import BaseModel
from openai import OpenAI
import base64
import os
from typing import Optional

app = FastAPI(title="Thunder EDTH", description="Danger Detection")

# Initialize OpenAI client (use environment variables for security in production)
API_KEY = os.getenv("DWANI_API_KEY", "your-api-key-here")
BASE_URL = os.getenv("DWANI_API_BASE_URL", "https://your-custom-endpoint.com/v1")

client = OpenAI(
    api_key=API_KEY,
    base_url=BASE_URL
)

class ImageQueryRequest(BaseModel):
    text: str
    image_url: str  # Can be HTTP URL or base64 data URL like "data:image/jpeg;base64,{base64_data}"
from pydantic import BaseModel

class TextQueryRequest(BaseModel):
    prompt: str
    system_prompt: str = "You are Weapons officer, who can identify military items accurately. Keep response to a single line, identify the weapon and its type"  # Optional system prompt; defaults to empty string


default_system_prompt = "You are Weapons officer, who can identify military items accurately. Keep response to a single line, identify the weapon and its type"
@app.post("/text_query")
async def text_query(request: TextQueryRequest):
    try:
        id_user_prompt = "identify the weapon :"
        user_prompt = id_user_prompt + request.prompt
        messages = [{"role": "user", "content": user_prompt}]
        if request.system_prompt.strip():  # Only add system message if provided and non-empty
            messages.insert(0, {"role": "system", "content": request.system_prompt})
        
        response = client.chat.completions.create(
            model="gemma3",
            messages=messages,
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
            model="gemma3",
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
    text: str = Form(...),
    system_prompt: str = Form(default_system_prompt),
    file: UploadFile = File(...)
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
            model="gemma3",
            messages=[
                {
                    "role": "system",
                    "content": system_prompt
                },
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


class ChatRequest(BaseModel):
    message: str
    session_id: Optional[str] = None

class ChatResponse(BaseModel):
    response: str
    session_id: str

class VisualQueryResponse(BaseModel):
    answer: str

    class Config:
        schema_extra = {"example": {"answer": "The image shows a screenshot of a webpage."}}

class ExtractTextResponse(BaseModel):
    extracted_text: str
    page_number: int
    language: str

class PdfSummaryResponse(BaseModel):
    summary: str
    tgt_lang: str
    model: str


@app.post("/v1/indic_chat", response_model=ChatResponse)
async def chat(chat_request: ChatRequest, api_key: str = Header(None)):

    # Dummy chat logic
    return ChatResponse(
        response=f"Response to: {chat_request.message}",
        session_id="dummy_session"
    )
from fastapi import Form, File, UploadFile, Query, Header

@app.post("/v1/indic_visual_query", response_model=VisualQueryResponse)
async def visual_query(
    file: UploadFile = File(...),
    query: str = Form(...),
    src_lang: str = Query("eng_Latn"),
    tgt_lang: str = Query("eng_Latn"),
    api_key: str = Header(None)
):
    # Hardcode or provide a default system prompt as string when calling internally

    response_content = await upload_image_query(text=query, system_prompt=default_system_prompt, file=file)

    print(response_content)
    return VisualQueryResponse(
        answer=response_content["response"],
        src_lang=src_lang,
        tgt_lang=tgt_lang
    )

@app.post("/v1/extract-text", response_model=ExtractTextResponse)
async def extract_text(
    file: UploadFile = File(...),
    page_number: int = Query(...),
    language: str = Query(...),
    api_key: str = Header(None)
):

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

    # Dummy PDF summary
    return PdfSummaryResponse(
        summary="Dummy PDF summary",
        tgt_lang=tgt_lang,
        model=model
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)