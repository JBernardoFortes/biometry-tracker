import React from "react";

interface HistoricProps {
  historico: { id: number; data: string; presentes: number; total: number }[];
}

const Historic = ({ historico }: HistoricProps) => {
  return (
    <section>
      <h2 className="text-lg font-semibold text-slate-800 mb-3">Histórico</h2>

      <ul className="divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white">
        {historico.map((registro) => (
          <li
            key={registro.id}
            className="flex items-center justify-between px-4 py-3"
          >
            <span className="text-sm text-slate-700">{registro.data}</span>
            <span className="text-sm text-slate-500">
              {registro.presentes}/{registro.total} presentes
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default Historic;
