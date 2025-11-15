# File: schemas.py (updated - added query_text and ai_response to UserCapture models)
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class UserCaptureCreate(BaseModel):
    user_id: str
    query_text: str
    image: str  # Base64 encoded string
    latitude: float
    longitude: float
    ai_response: str
    # created_at is auto-generated in DB

class UserCaptureUpdate(BaseModel):
    user_id: Optional[str] = None
    query_text: Optional[str] = None
    image: Optional[str] = None  # Base64 encoded string
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    ai_response: Optional[str] = None
    # created_at is not updatable

class UserCaptureResponse(BaseModel):
    id: int = Field(..., alias="id")
    userId: str = Field(..., alias="user_id")
    queryText: str = Field(..., alias="query_text")
    image: str = Field(..., alias="image")  # Base64 encoded string
    latitude: float = Field(..., alias="latitude")
    longitude: float = Field(..., alias="longitude")
    aiResponse: str = Field(..., alias="ai_response")
    createdAt: datetime = Field(..., alias="created_at")

    class Config:
        from_attributes = True  # Allows mapping from SQLAlchemy models