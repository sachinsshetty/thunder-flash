# main.py
from fastapi import FastAPI
import uvicorn

from config import DEFAULT_SYSTEM_PROMPT
from models import TextQueryRequest  # Update the default in models after import
from routers.core import router as core_router
from routers.v1 import router as v1_router

# Update the default in TextQueryRequest after importing config
TextQueryRequest.__fields__["system_prompt"].default = DEFAULT_SYSTEM_PROMPT

app = FastAPI(title="Thunder EDTH", description="Danger Detection")

app.include_router(core_router)
app.include_router(v1_router)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)