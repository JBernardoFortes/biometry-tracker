from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles

from app.routers.eventos import router as eventos_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Biometry Tracker API",
    description="Inthttp://localhost:8000/eventopsegração entre o hardware e o frontend do sistema de frequência por biometria.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
)
app.include_router(eventos_router)
app.mount("/uploads", StaticFiles(directory="app/uploads"), name="uploads")
