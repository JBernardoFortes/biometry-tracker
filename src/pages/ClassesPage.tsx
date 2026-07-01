import { Link } from "react-router-dom";
import { turmas } from "../mocks/mock";

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

            <span className="inline-block mt-1 mb-3 text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
              {turma.turno}
            </span>

            <div className="flex flex-wrap gap-1 mb-2">
              {turma.dias.map((dia) => (
                <span
                  key={dia}
                  className="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded"
                >
                  {dia}
                </span>
              ))}
            </div>

            <p className="text-sm text-slate-500">
              {turma.horarioInicio} — {turma.horarioFim}
            </p>
            <p className="text-sm text-slate-500">
              {turma.totalAlunos} aluno(s)
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
