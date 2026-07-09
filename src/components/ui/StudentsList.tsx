import type { Aluno } from "../../types/index.ts";

interface StudentsListProps {
  selectedDate: string;
  alunosComPresencaDoDia: Aluno[];
}
export const StudentsList = ({
  selectedDate,
  alunosComPresencaDoDia,
}: StudentsListProps) => {
  return (
    <section>
      <h2 className="text-lg font-semibold text-slate-800 mb-3">
        Alunos — {selectedDate}
      </h2>

      <ul className="divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white">
        {alunosComPresencaDoDia.map((aluno) => (
          <li
            key={aluno.id}
            className="flex items-center justify-between px-4 py-3"
          >
            <div>
              <p className="text-sm font-medium text-slate-700">{aluno.nome}</p>
              <p className="text-xs text-slate-400">
                Matrícula: {aluno.matricula}
              </p>
            </div>

            <span
              className={`text-xs font-medium px-2 py-1 rounded-full ${
                aluno.presente
                  ? "bg-emerald-50 text-emerald-600"
                  : "bg-slate-100 text-slate-500"
              }`}
            >
              {aluno.presente ? "Presente" : "Ausente"}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
};
