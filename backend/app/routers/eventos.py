from app.models.evento import EventoRequest
from typing import Optional
from app.storage.memoria import (
    adicionar_evento,
    listar_eventos,
    limpar_eventos
)

from fastapi import APIRouter, UploadFile, File

router = APIRouter()

@router.post("/evento")
def receber_evento(evento: EventoRequest):
    adicionar_evento(evento.model_dump())

    return {
        "mensagem": "Evento recebido com sucesso."
    }

@router.post("/evento/imagem")
async def receber_imagem(imagem: UploadFile = File(...)):
    return {
        "mensagem": "Imagem recebida com sucesso.",
        "nome_arquivo": imagem.filename,
        "tipo": imagem.content_type
    }

@router.get("/eventos")
def obter_eventos(evento: Optional[str] = None):
    eventos = listar_eventos()

    if evento:
        eventos = [
            e for e in eventos
            if e["evento"] == evento
        ]

    return eventos

@router.delete("/eventos")
def apagar_eventos():
    limpar_eventos()

    return {
        "mensagem": "Eventos apagados com sucesso."
    }