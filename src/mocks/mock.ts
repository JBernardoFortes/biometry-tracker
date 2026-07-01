// depoois adaptar o mock para chamadas de api


export const turmas = [
  {
    id: 1,
    nome: "Turma A",
    turno: "Manhã",
    dias: ["Seg", "Qua", "Sex"],
    horarioInicio: "08:00",
    horarioFim: "09:40",
    totalAlunos: 4,
  },
  {
    id: 2,
    nome: "Turma B",
    turno: "Tarde",
    dias: ["Ter", "Qui"],
    horarioInicio: "13:30",
    horarioFim: "15:10",
    totalAlunos: 3,
  },
  {
    id: 3,
    nome: "Turma C",
    turno: "Noite",
    dias: ["Seg", "Qua"],
    horarioInicio: "19:00",
    horarioFim: "20:40",
    totalAlunos: 3,
  },
];

export const alunosPorTurma = {
  1: [
    { id: 1, matricula: "2026001", nome: "Ana Souza", presente: false },
    { id: 2, matricula: "2026002", nome: "Bruno Lima", presente: false },
    { id: 3, matricula: "2026003", nome: "Carla Dias", presente: false },
    { id: 4, matricula: "2026004", nome: "Diego Alves", presente: false },
  ],
  2: [
    { id: 5, matricula: "2026005", nome: "Elaine Rocha", presente: false },
    { id: 6, matricula: "2026006", nome: "Felipe Nunes", presente: false },
    { id: 7, matricula: "2026007", nome: "Gabriela Melo", presente: false },
  ],
  3: [
    { id: 8, matricula: "2026008", nome: "Hugo Ramos", presente: false },
    { id: 9, matricula: "2026009", nome: "Isabela Cruz", presente: false },
    { id: 10, matricula: "2026010", nome: "João Pedro", presente: false },
  ],
};

export const historicoPorTurma = {
  1: [
    {
      id: 1,
      data: "2026-06-29",
      alunoId: 1,
      alunoNome: "Ana Souza",
      tipo: "entrada",
      horario: "08:02",
    },
    {
      id: 2,
      data: "2026-06-29",
      alunoId: 2,
      alunoNome: "Bruno Lima",
      tipo: "entrada",
      horario: "08:04",
    },
    {
      id: 3,
      data: "2026-06-29",
      alunoId: 1,
      alunoNome: "Ana Souza",
      tipo: "saida",
      horario: "09:38",
    },
    {
      id: 4,
      data: "2026-06-29",
      alunoId: 2,
      alunoNome: "Bruno Lima",
      tipo: "saida",
      horario: "09:41",
    },
    {
      id: 5,
      data: "2026-07-01",
      alunoId: 1,
      alunoNome: "Ana Souza",
      tipo: "entrada",
      horario: "07:58",
    },
    {
      id: 6,
      data: "2026-07-01",
      alunoId: 3,
      alunoNome: "Carla Dias",
      tipo: "entrada",
      horario: "08:05",
    },
    {
      id: 7,
      data: "2026-07-01",
      alunoId: 4,
      alunoNome: "Diego Alves",
      tipo: "entrada",
      horario: "08:07",
    },
    {
      id: 8,
      data: "2026-07-01",
      alunoId: 3,
      alunoNome: "Carla Dias",
      tipo: "saida",
      horario: "08:50",
    },
  ],
  2: [
    {
      id: 9,
      data: "2026-06-30",
      alunoId: 5,
      alunoNome: "Elaine Rocha",
      tipo: "entrada",
      horario: "13:32",
    },
    {
      id: 10,
      data: "2026-06-30",
      alunoId: 6,
      alunoNome: "Felipe Nunes",
      tipo: "entrada",
      horario: "13:35",
    },
    {
      id: 11,
      data: "2026-06-30",
      alunoId: 5,
      alunoNome: "Elaine Rocha",
      tipo: "saida",
      horario: "15:09",
    },
  ],
  3: [
    {
      id: 12,
      data: "2026-06-29",
      alunoId: 8,
      alunoNome: "Hugo Ramos",
      tipo: "entrada",
      horario: "19:03",
    },
    {
      id: 13,
      data: "2026-06-29",
      alunoId: 9,
      alunoNome: "Isabela Cruz",
      tipo: "entrada",
      horario: "19:06",
    },
    {
      id: 14,
      data: "2026-06-29",
      alunoId: 8,
      alunoNome: "Hugo Ramos",
      tipo: "saida",
      horario: "20:39",
    },
  ],
};

export const fotosPorTurmaEData = {
  "1-2026-07-01": [
    {
      id: 1,
      url: "https://picsum.photos/seed/turma1a/400/300",
      horario: "07:58",
    },
    {
      id: 2,
      url: "https://picsum.photos/seed/turma1b/400/300",
      horario: "08:05",
    },
    {
      id: 3,
      url: "https://picsum.photos/seed/turma1c/400/300",
      horario: "08:07",
    },
  ],
  "1-2026-06-29": [
    {
      id: 4,
      url: "https://picsum.photos/seed/turma1d/400/300",
      horario: "08:02",
    },
    {
      id: 5,
      url: "https://picsum.photos/seed/turma1e/400/300",
      horario: "08:04",
    },
  ],
  "2-2026-06-30": [
    {
      id: 6,
      url: "https://picsum.photos/seed/turma2a/400/300",
      horario: "13:32",
    },
  ],
  "3-2026-06-29": [
    {
      id: 7,
      url: "https://picsum.photos/seed/turma3a/400/300",
      horario: "19:03",
    },
    {
      id: 8,
      url: "https://picsum.photos/seed/turma3b/400/300",
      horario: "19:06",
    },
  ],
};
