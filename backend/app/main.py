from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles

from app.routers.eventos import router as eventos_router

app = FastAPI(
    title="Biometry Tracker API",
    description="Integração entre o hardware e o frontend do sistema de frequência por biometria.",
    version="1.0.0"
)

app.include_router(eventos_router)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")