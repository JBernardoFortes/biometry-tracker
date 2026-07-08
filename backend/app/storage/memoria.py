from datetime import datetime

eventos = []

def adicionar_evento(evento):
    evento["data"] = datetime.now()
    eventos.append(evento)
    return evento

def listar_eventos():
    return eventos

def limpar_eventos():
    eventos.clear()