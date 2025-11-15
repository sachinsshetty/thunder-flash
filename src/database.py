# File: database.py (updated - load mock data from separate JSON file with defaults for new fields)
import os
import json
from pathlib import Path
from sqlalchemy import create_engine, Column, Integer, String, DateTime, Text, Float
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import logging
from datetime import datetime
from constants import MOCK_DATA_JSON
logger = logging.getLogger(__name__)

SQLITE_DB_PATH = os.getenv("SQLITE_DB_PATH", "app.db")
db_dir = Path(SQLITE_DB_PATH).parent
db_dir.mkdir(parents=True, exist_ok=True)
engine = create_engine(f"sqlite:///{SQLITE_DB_PATH}", echo=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class UserCapture(Base):
    __tablename__ = "user_captures"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, index=True)
    query_text = Column(Text)
    image = Column(Text)  # Base64 encoded string
    latitude = Column(Float)
    longitude = Column(Float)
    ai_response = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)

Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

async def startup_event():
    db = SessionLocal()
    try:
        # Handle UserCapture mock data insertion
        if db.query(UserCapture).count() == 0:
            if not MOCK_DATA_JSON.exists():
                logger.warning(f"Mock data JSON file not found at {MOCK_DATA_JSON}. Skipping mock data insertion.")
            else:
                try:
                    with open(MOCK_DATA_JSON, 'r', encoding='utf-8') as jsonfile:
                        mock_data = json.load(jsonfile)
                    
                    # Add defaults for new fields if missing (for backward compatibility)
                    for data in mock_data:
                        if "query_text" not in data:
                            data["query_text"] = "What is this weapon?"
                        if "ai_response" not in data:
                            data["ai_response"] = "This is a mock identification response for the image."
                    
                    logger.info(f"Loaded {len(mock_data)} user captures from JSON with defaults applied.")
                except Exception as e:
                    logger.error(f"Failed to load mock data JSON: {str(e)}. Skipping mock data insertion.")
                    mock_data = []

                for data in mock_data:
                    # Check for duplicates before adding (based on user_id)
                    if db.query(UserCapture).filter(UserCapture.user_id == data["user_id"]).first():
                        logger.info(f"Skipping existing user capture for {data['user_id']}.")
                        continue
                    
                    # No need to parse created_at as it's auto-generated
                    user_capture = UserCapture(**data)
                    db.add(user_capture)
                db.commit()
                logger.info("Mock data inserted successfully.")
        else:
            logger.info("UserCapture table already populated. Skipping mock data insertion.")
    finally:
        db.close()