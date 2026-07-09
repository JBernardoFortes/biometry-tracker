export type TipoEvento = "entrada" | "saida";

export interface EventoApi {
  evento: TipoEvento;
  biometriaId?: number;
  distancia?: number;
  data: string; 
}

export interface Aluno {
  id: number; // = biometriaId
  matricula: string;
  nome: string;
}

export interface AlunoComPresenca extends Aluno {
  presente: boolean;
  totalEventos: number;
}

export interface Foto {
  id: number;
  url: string;
  horario: string;
}