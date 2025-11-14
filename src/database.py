# File: database.py (updated - replaced ClientProfile table with user_capture table)
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
    image = Column(Text)  # Base64 encoded string
    latitude = Column(Float)
    longitude = Column(Float)
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
        # No mock data insertion for user_captures at this time
        logger.info("Database startup completed.")
    finally:
        db.close()