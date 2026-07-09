import type { RegistroHistorico } from "../../types/index.ts";

interface HistoricProps {
  historicoDoDia: RegistroHistorico[];
}

const Historic = ({ historicoDoDia }: HistoricProps) => {
  return (
    <section>
      <h2 className="text-lg font-semibold text-slate-800 mb-3">
        Histórico de entrada e saída
      </h2>

      {historicoDoDia.length === 0 ? (
        <p className="text-sm text-slate-500">
          Nenhum registro para esta data.
        </p>
      ) : (
        <ul className="divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white">
          {historicoDoDia.map((registro) => (
            <li
              key={registro.id}
              className="flex items-center justify-between px-4 py-3"
            >
              <div>
                <p className="text-sm font-medium text-slate-700">
                  {registro.alunoNome}
                </p>
                <p className="text-xs text-slate-400">{registro.horario}</p>
              </div>

              <span
                className={`text-xs font-medium px-2 py-1 rounded-full ${
                  registro.tipo === "entrada"
                    ? "bg-indigo-50 text-indigo-600"
                    : "bg-amber-50 text-amber-600"
                }`}
              >
                {registro.tipo === "entrada" ? "Entrada" : "Saída"}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default Historic;
