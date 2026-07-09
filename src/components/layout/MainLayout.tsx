import { Outlet } from "react-router-dom";
import Sidebar from "../Sidebar";

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-row justify-start">
      <Sidebar />

      <main className="p-8">
        <Outlet />
      </main>
    </div>
  );
}
