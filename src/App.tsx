import Sidebar from "./components/layout/Sidebar";
import MainLayout from "./components/layout/MainLayout";
import ClassesPage from "./pages/ClassesPage";
import ClassPage from "./pages/ClassPage";
import RegisterBiometry from "./pages/RegisterBiometry";

import { createBrowserRouter } from "react-router-dom";

createBrowserRouter([
  {
    element: <App />,
    path: "/",
    children: [
      {
        path: "/",
        element: <ClassesPage></ClassesPage>
      },
      {
        path: "/class/:classId",
        element: <ClassPage></ClassPage>
      }
      , {
        path: "/class/:classId/register-fingerprint"
        , element: <RegisterBiometry></RegisterBiometry>
      }

    ]
  },
]);

function App() {
  return (
    <div className="text-3xl text-amber-400">
      <Sidebar></Sidebar>
      <MainLayout>
      </MainLayout>
    </div>
  );
}

export default App;
