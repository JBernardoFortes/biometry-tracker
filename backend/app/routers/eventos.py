import os
from app.models.evento import EventoRequest
from typing import Optional
from app.storage.memoria import (
    adicionar_evento,
    listar_eventos,
    limpar_eventos
)

from datetime import datetime
from pathlib import Path
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
    pasta_imagens = Path("uploads")
    pasta_imagens.mkdir(exist_ok=True)

    extensao = Path(imagem.filename).suffix
    nome_arquivo = datetime.now().strftime("%Y%m%d_%H%M%S_%f") + extensao

    caminho_arquivo = pasta_imagens / nome_arquivo

    with open(caminho_arquivo, "wb") as arquivo:
        arquivo.write(await imagem.read())

    return {
        "mensagem": "Imagem recebida com sucesso.",
        "arquivo": str(caminho_arquivo)
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


@router.get("/evento/imagem")
def listar_imagens():
    pasta = Path("uploads")
    if not pasta.exists():
        return []
    return sorted(os.listdir(pasta))