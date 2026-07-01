import { Link } from "react-router-dom";

export default function ClassesPage() {
  return (
    <div>
      <h1>Turmas</h1>
      <p>Lista de todas as turmas cadastradas.</p>

      <Link to="/class/1">Ver turma 1</Link>
    </div>
  );
}
