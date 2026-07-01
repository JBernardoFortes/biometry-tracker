

const salvarFrequencia = () => {}

interface ClassPageHeaderProps { 
    id: number
}

const ClassPageHeader = ({ id }: ClassPageHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-6 gap-10">
      <h1 className="text-2xl font-bold text-slate-800">Turma #{id}</h1>

      <div className="flex gap-3">

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
