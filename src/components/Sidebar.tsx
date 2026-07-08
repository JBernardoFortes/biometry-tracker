import { NavLink } from "react-router-dom";

interface SidebarLink {
  to: string;
  label: string;
}

const links: SidebarLink[] = [
  { to: "/", label: "Turma" },
];

export default function Sidebar() {
  return (
    <aside className=" inset-y-0 left-0 w-60 flex flex-col bg-slate-900 text-white p-6">
      <div className="text-lg font-bold mb-8">Minha Aplicação</div>

      <nav className="flex flex-col gap-2">
        {links.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive
                  ? "bg-indigo-600 text-white"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`
            }
          >
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}