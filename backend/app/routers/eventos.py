from app.models.evento import EventoRequest
from app.storage.memoria import (
    adicionar_evento,
    listar_eventos,
    limpar_eventos
)

from fastapi import APIRouter

router = APIRouter()

@router.post("/evento")
def receber_evento(evento: EventoRequest):
    adicionar_evento(evento.model_dump())

    return {
        "mensagem": "Evento recebido com sucesso."
    }

@router.get("/eventos")
def obter_eventos():
    return listar_eventos()

@router.delete("/eventos")
def apagar_eventos():
    limpar_eventos()

    return {
        "mensagem": "Eventos apagados com sucesso."
    }