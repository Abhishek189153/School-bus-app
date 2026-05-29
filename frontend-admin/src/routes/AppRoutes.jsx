import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Students from "../pages/Students";
import Drivers from "../pages/Drivers";
import Parents from "../pages/Parents";
import Buses from "../pages/Buses";
import RoutesPage from "../pages/Routes";

import ProtectedRoute from "../guards/ProtectedRoute";
import AdminLayout from "../layouts/AdminLayout";

const AppRoutes = () => {
  return (
    <BrowserRouter>

      <Routes>

        {/* Public Route */}
        <Route
          path="/login"
          element={<Login />}
        />

        {/* Protected Layout */}
        <Route
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >

          <Route
            path="/"
            element={<Dashboard />}
          />

          <Route
            path="/students"
            element={<Students />}
          />

          <Route
            path="/drivers"
            element={<Drivers />}
          />

          <Route
            path="/parents"
            element={<Parents />}
          />

          <Route
            path="/buses"
            element={<Buses />}
          />

          <Route
            path="/routes"
            element={<RoutesPage />}
          />

        </Route>

      </Routes>

    </BrowserRouter>
  );
};

export default AppRoutes;