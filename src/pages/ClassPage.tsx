import { useState } from "react";
import { useParams } from "react-router-dom";
import ClassPageHeader from "../components/ui/ClassPageHeader";
import { StudentsList } from "../components/ui/StudentsList";
import Historic from "../components/ui/Historic";

const alunosMock = [
  { id: 1, nome: "Ana Souza", presente: false },
  { id: 2, nome: "Bruno Lima", presente: false },
  { id: 3, nome: "Carla Dias", presente: false },
  { id: 4, nome: "Diego Alves", presente: false },
];

const historicoMock = [
  { id: 1, data: "28/06/2026", presentes: 26, total: 28 },
  { id: 2, data: "21/06/2026", presentes: 24, total: 28 },
  { id: 3, data: "14/06/2026", presentes: 27, total: 28 },
];

export default function ClassPage() {
  const { id } = useParams();
  // de acordo com esse id fazer a requisicao no servidor pra pegar os dados da turma e passar pro s ccomponentes
  const [alunos, setAlunos] = useState(alunosMock);


  return (
    <div>
      <ClassPageHeader id={Number(id)} />

      <StudentsList alunos={alunos} />

      {/* Histórico de frequência */}
      <Historic historico={historicoMock} />
    </div>
  );
}