
interface StudentsListProps { 
    alunos: { id: number; nome: string; presente: boolean }[]
}
export const StudentsList = ({alunos} : StudentsListProps) => {
  return (
    <section className="mb-8">
      <h2 className="text-lg font-semibold text-slate-800 mb-3">Alunos</h2>

      <ul className="divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white">
        {alunos.map((aluno) => (
          <li
            key={aluno.id}
            className="flex items-center justify-between px-4 py-3"
          >
            <span className="text-sm text-slate-700">{aluno.nome}</span>

              Presente
          </li>
        ))}
      </ul>
    </section>
  );
};
