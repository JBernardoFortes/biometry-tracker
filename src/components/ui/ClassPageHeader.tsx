import type { Turma } from "../../types/index.ts";

const salvarFrequencia = () => {}

interface ClassPageHeaderProps { 
    turma: Turma
    setPhotoModalOpen: (open: boolean) => void
}

const ClassPageHeader = ({ turma, setPhotoModalOpen }: ClassPageHeaderProps) => {
  return (
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">{turma.nome}</h1>
          <p className="text-sm text-slate-500">
            {turma.dias.join(", ")} · {turma.horarioInicio} — {turma.horarioFim}
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setPhotoModalOpen(true)}
            className="px-4 py-2 rounded-md text-sm font-medium border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            Ver Imagens da Câmera
          </button>

          <button
            onClick={salvarFrequencia}
            className="px-4 py-2 rounded-md text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 transition-colors cursor-pointer"
          >
            Salvar Frequência
          </button>
        </div>
      </div>
  );
};

export default ClassPageHeader;
