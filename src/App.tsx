import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";

import MainLayout from "./components/layout/MainLayout";

import ClassPage from "./pages/ClassPage";
import ClassesPage from "./pages/ClassesPage";

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
        path: "/",
        element: <Navigate to="/classes" replace />,
      },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
