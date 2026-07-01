import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";

import MainLayout from "./components/layout/MainLayout";

import ClassPage from "./pages/ClassPage";
import ClassesPage from "./pages/ClassesPage";
import RegisterBiometryPage from "./pages/RegisterBiometryPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/classes" replace />,
      },
      {
        path: "class/:id",
        element: <ClassPage />,
      },
      {
        path: "classes",
        element: <ClassesPage />,
      },
      {
        path: "register-biometry",
        element: <RegisterBiometryPage />,
      },
      {
        path: "/",
        element: <Navigate to="/classes" replace />,
      },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
