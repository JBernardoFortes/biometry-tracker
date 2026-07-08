import { API_BASE_URL } from "../config/api";
import type { EventoApi, Foto } from "../types";

export async function fetchEventos(): Promise<EventoApi[]> {
  const response = await fetch(`${API_BASE_URL}/eventos`);
  if (!response.ok) {
    throw new Error("Erro ao buscar eventos");
  }
  return response.json();
}

export async function limparEventos(): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/eventos`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Erro ao apagar eventos");
  }
}
function extrairHorarioDoNomeArquivo(nomeArquivo: string): string {
  const [dataHora] = nomeArquivo.split(".");
  const [, horaBruta] = dataHora.split("_");

  if (!horaBruta || horaBruta.length < 6) return "--:--:--";

  const horas = horaBruta.slice(0, 2);
  const minutos = horaBruta.slice(2, 4);
  const segundos = horaBruta.slice(4, 6);

  return `${horas}:${minutos}:${segundos}`;
}

export async function fetchFotos(): Promise<Foto[]> {
  const response = await fetch(`${API_BASE_URL}/evento/imagem`);
    console.log(response)
  if (!response.ok) {
    throw new Error("Erro ao buscar imagens");
  }

  const arquivos: string[] = await response.json();

  return arquivos.map((nomeArquivo, index) => ({
    id: index,
    url: `${API_BASE_URL}/uploads/${nomeArquivo}`,
    horario: extrairHorarioDoNomeArquivo(nomeArquivo),
  }));
}
