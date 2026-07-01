import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";

import Calendar from "../components/ui/Calendar";
import PhotoVerificationModal from "../components/ui/PhotoVerificationModal";

import {
  turmas,
  alunosPorTurma,
  historicoPorTurma,
  fotosPorTurmaEData,
} from "../mocks/mock";
import type { AlunoComPresencaDoDia, RegistroHistorico } from "../types";
import ClassPageHeader from "../components/ui/ClassPageHeader";
import { StudentsList } from "../components/ui/StudentsList";
import Historic from "../components/ui/Historic";

export default function ClassPage() {
  const { id } = useParams<{ id: string }>();
  const turmaId = Number(id);

  const turma = turmas.find((t) => t.id === turmaId);
  const alunos = alunosPorTurma[turmaId] ?? [];
  const historicoCompleto = historicoPorTurma[turmaId] ?? [];

  const datasComRegistro = useMemo(
    () => [...new Set(historicoCompleto.map((registro) => registro.data))],
    [historicoCompleto],
  );

  const [selectedDate, setSelectedDate] = useState<string>(
    datasComRegistro[datasComRegistro.length - 1] ??
      new Date().toISOString().slice(0, 10),
  );
  const [isPhotoModalOpen, setPhotoModalOpen] = useState(false);

  const historicoDoDia: RegistroHistorico[] = useMemo(
    () =>
      historicoCompleto
        .filter((registro) => registro.data === selectedDate)
        .sort((a, b) => a.horario.localeCompare(b.horario)),
    [historicoCompleto, selectedDate],
  );

  const alunosComPresencaDoDia: AlunoComPresencaDoDia[] = useMemo(() => {
    return alunos.map((aluno) => {
      const eventosDoAluno = historicoDoDia.filter(
        (registro) => registro.alunoId === aluno.id,
      );
      const ultimoEvento = eventosDoAluno[eventosDoAluno.length - 1];

      return {
        ...aluno,
        presente: ultimoEvento ? ultimoEvento.tipo === "entrada" : false,
      };
    });
  }, [alunos, historicoDoDia]);

  const fotosDoDia = fotosPorTurmaEData[`${turmaId}-${selectedDate}`] ?? [];

  if (!turma) {
    return <p className="text-slate-500">Turma não encontrada.</p>;
  }

  return (
    <div>
      {/* Cabeçalho com ações */}
      <ClassPageHeader turma={turma} setPhotoModalOpen={setPhotoModalOpen} />

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
        {/* Calendário para selecionar o dia */}
        <div>
          <h2 className="text-lg font-semibold text-slate-800 mb-3">
            Selecionar data
          </h2>
          <Calendar
            value={selectedDate}
            onChange={setSelectedDate}
            highlightedDates={datasComRegistro}
          />
        </div>

        <div className="space-y-8">
          {/* Lista de alunos */}
          <StudentsList
            selectedDate={selectedDate}
            alunosComPresencaDoDia={alunosComPresencaDoDia}
          />
          {/* Histórico de entrada/saída do dia */}
          <Historic historicoDoDia={historicoDoDia} />
        </div>
      </div>

      <PhotoVerificationModal
        isOpen={isPhotoModalOpen}
        onClose={() => setPhotoModalOpen(false)}
        fotos={fotosDoDia}
        turmaNome={turma.nome}
        data={selectedDate}
      />
    </div>
  );
}
