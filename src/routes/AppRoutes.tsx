import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";

import ClassPage from "../pages/ClassPage";
import ClassesPage from "../pages/ClassesPage";
import RegisterBiometryPage from "../pages/RegisterBiometryPage";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Navigate to="/classes" replace />} />

          <Route path="class/:id" element={<ClassPage />} />
          <Route path="classes" element={<ClassesPage />} />
          <Route path="register-biometry" element={<RegisterBiometryPage />} />

          {/* Rota curinga para páginas não encontradas */}
          <Route path="*" element={<Navigate to="/classes" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
