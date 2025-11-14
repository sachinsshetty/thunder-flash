# main.py
from fastapi import FastAPI
import uvicorn

from routers.core import router as core_router
from routers.v1 import router as v1_router

app = FastAPI(title="Thunder EDTH", description="Danger Detection")

app.include_router(core_router)
app.include_router(v1_router)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)