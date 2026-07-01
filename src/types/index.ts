export interface Turma {
  id: number;
  nome: string;
  turno: "Manhã" | "Tarde" | "Noite";
  dias: string[];
  horarioInicio: string;
  horarioFim: string;
  totalAlunos: number;
}

export interface Aluno {
  id: number;
  matricula: string;
  nome: string;
  presente: boolean;
}

export type TipoRegistro = "entrada" | "saida";

export interface RegistroHistorico {
  id: number;
  data: string; // "YYYY-MM-DD"
  alunoId: number;
  alunoNome: string;
  tipo: TipoRegistro;
  horario: string; // "HH:mm"
}

export interface Foto {
  id: number;
  url: string;
  horario: string;
}

/** Aluno com o status de presença já recalculado para uma data específica */
export interface AlunoComPresencaDoDia extends Aluno {
  presente: boolean;
}