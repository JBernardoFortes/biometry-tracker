import { useEffect, useMemo, useState } from "react";

import PhotoVerificationModal from "../components/ui/PhotoVerificationModal.tsx";
import { alunosCadastrados } from "../mocks/mock.ts";
import { fetchEventos, fetchFotos } from "../services/eventosAPI.ts";
import type { AlunoComPresenca, EventoApi, Foto } from "../types";

const POLLING_INTERVAL_MS = 3000;

function formatarHorario(dataIso: string): string {
  return new Date(dataIso).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export default function ClassPage() {
  const [eventos, setEventos] = useState<EventoApi[]>([]);
  const [fotos, setFotos] = useState<Foto[]>([]);
  const [isPhotoModalOpen, setPhotoModalOpen] = useState(false);
  const [isSalvando, setIsSalvando] = useState(false);

  useEffect(() => {
    let ativo = true;

    async function carregarEventos() {
      try {
        const dados = await fetchEventos();
        if (ativo) setEventos(dados);
      } catch (erro) {
        console.error(erro);
      }
    }

    carregarEventos();
    const intervalId = setInterval(carregarEventos, POLLING_INTERVAL_MS);

    return () => {
      ativo = false;
      clearInterval(intervalId);
    };
  }, []);

  const alunosComPresenca: AlunoComPresenca[] = useMemo(() => {
    return alunosCadastrados.map((aluno: any) => {
      const eventosDoAluno = eventos
        .filter((evento) => evento.biometriaId === aluno.id)
        .sort(
          (a, b) => new Date(a.data).getTime() - new Date(b.data).getTime(),
        );

      const totalEventos = eventosDoAluno.length;
      const presente = totalEventos > 0 && totalEventos % 2 === 1;

      return { ...aluno, presente, totalEventos };
    });
  }, [eventos]);

  const logsOrdenados = useMemo(
    () =>
      [...eventos].sort(
        (a, b) => new Date(b.data).getTime() - new Date(a.data).getTime(),
      ),
    [eventos],
  );

  function nomeDoAluno(biometriaId?: number): string {
    if (biometriaId === undefined) return "Desconhecido";
    return (
      alunosCadastrados.find((aluno: any) => aluno.id === biometriaId)?.nome ??
      `ID ${biometriaId}`
    );
  }

  async function salvarPresenca() {
    setIsSalvando(true);
    try {
      console.log("Salvando presença", alunosComPresenca);
    } finally {
      setIsSalvando(false);
    }
  }

  async function abrirModalFotos() {
    const fotosCarregadas = await fetchFotos();
    setFotos(fotosCarregadas);
    setPhotoModalOpen(true);
  }

  return (
    <div className="w-full">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Turma</h1>
      </div>

      {/* Conteúdo principal */}
      <div className="flex w-full gap-8 mb-8">
        {/* Tabela de alunos */}
        <section className="flex-1 min-w-125">
          <h2 className="text-lg font-semibold text-slate-800 mb-3">Alunos</h2>

          <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left text-xs font-medium text-slate-500 uppercase">
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">Matrícula</th>
                  <th className="px-4 py-3">Nome</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200">
                {alunosComPresenca.map((aluno) => (
                  <tr key={aluno.id}>
                    <td className="px-4 py-3 text-slate-500">{aluno.id}</td>
                    <td className="px-4 py-3 text-slate-500">
                      {aluno.matricula}
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-700">
                      {aluno.nome}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-xs font-medium px-2 py-1 rounded-full ${
                          aluno.presente
                            ? "bg-emerald-50 text-emerald-600"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {aluno.presente ? "Presente" : "Ausente"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Logs */}
        <section className="flex-1">
          <h2 className="text-lg font-semibold text-slate-800 mb-3">
            Logs da Turma
          </h2>
          <div className="rounded-xl border border-slate-200 bg-white overflow-hidden max-h-80 overflow-y-auto min-w-125">
            {logsOrdenados.length === 0 ? (
              <p className="p-4 text-sm text-slate-500">
                Nenhum evento recebido ainda.
              </p>
            ) : (
              <table className="w-full text-sm ">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs font-medium text-slate-500 uppercase">
                    <th className="px-4 py-3">Aluno</th>
                    <th className="px-4 py-3">Horário</th>
                    <th className="px-4 py-3">Evento</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-200">
                  {logsOrdenados.map((evento, index) => (
                    <tr key={`${evento.data}-${index}`}>
                      <td className="px-4  font-medium text-slate-700">
                        {nomeDoAluno(evento.biometriaId)}
                      </td>

                      <td className="px-4 text-slate-600">
                        {formatarHorario(evento.data)}
                      </td>


                      <td className="px-4 py-3">
                        <span
                          className={`text-xs font-medium px-2 py-1 rounded-full ${
                            evento.evento === "entrada"
                              ? "bg-indigo-50 text-indigo-600"
                              : "bg-amber-50 text-amber-600"
                          }`}
                        >
                          {evento.evento === "entrada" ? "Entrada" : "Saída"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>
      </div>

      {/* Botões */}
      <div className="flex gap-3">
        <button
          onClick={salvarPresenca}
          disabled={isSalvando}
          className="px-4 py-2 rounded-md text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 transition-colors cursor-pointer"
        >
          {isSalvando ? "Salvando..." : "Salvar Presença"}
        </button>

        <button
          onClick={abrirModalFotos}
          className="px-4 py-2 rounded-md text-sm font-medium border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
        >
          Ver Fotos
        </button>
      </div>
      {/* Ações */}

      <PhotoVerificationModal
        isOpen={isPhotoModalOpen}
        onClose={() => setPhotoModalOpen(false)}
        fotos={fotos}
        turmaNome="Turma"
        data={new Date().toLocaleDateString("pt-BR")}
      />
    </div>
  );
}
