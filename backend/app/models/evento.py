from typing import Optional

from pydantic import BaseModel

class EventoRequest(BaseModel):
    evento: str
    biometriaId: int