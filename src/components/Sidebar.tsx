import { NavLink } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside>
      <div>Minha Aplicação</div>

      <nav>
        <NavLink to="/classes">Turmas</NavLink>

        <NavLink to="/register-biometry">Cadastrar Biometria</NavLink>
      </nav>
    </aside>
  );
}
