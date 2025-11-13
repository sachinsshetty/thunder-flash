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
    model: str = "gemma3"
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

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)