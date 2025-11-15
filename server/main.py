# File: main.py (updated - added startup event call)
from fastapi import FastAPI
import uvicorn
from fastapi.middleware.cors import CORSMiddleware
from middleware import TimingMiddleware
from database import startup_event
from fastapi.responses import RedirectResponse

from routers.core import router as core_router
from routers.v1 import router as v1_router

app = FastAPI(title="Thunder EDTH", description="Danger Detection")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(core_router)
app.include_router(v1_router)


@app.get("/",
         summary="Redirect to Docs",
         description="Redirects to the Swagger UI documentation.",
         tags=["Utility"])
async def home():
    return RedirectResponse(url="/docs")

@app.on_event("startup")
async def on_startup():
    await startup_event()

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)