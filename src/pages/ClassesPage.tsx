import { Link } from "react-router-dom";

// Mock — substitua por dados vindos da API
const turmas = [
  { id: 1, nome: "Topicos em computacao aplicada", turno: "Manhã", alunos: 28 },
  { id: 2, nome: "Engenharia de software", turno: "Tarde", alunos: 24 },
  { id: 3, nome: "Arquitetura de computadores", turno: "Noite", alunos: 19 },
  { id: 4, nome: "Introducao a logica", turno: "Manhã", alunos: 31 },
];

export default function ClassesPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Turmas</h1>

      {/* Grid de turmas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {turmas.map((turma) => (
          <Link
            key={turma.id}
            to={`/class/${turma.id}`}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all"
          >
            <h2 className="text-lg font-semibold text-slate-800">
              {turma.nome}
            </h2>
            <p className="text-sm text-slate-500 mt-1">{turma.turno}</p>
            <p className="text-sm text-slate-500">
              {turma.alunos} aluno(s)
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}