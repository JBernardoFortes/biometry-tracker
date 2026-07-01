import { useParams } from "react-router-dom";

export default function ClassPage() {
  const { id } = useParams();

  return (
    <div>
      <h1>Turma #{id}</h1>
      <p>Detalhes da turma selecionada.</p>
    </div>
  );
}
