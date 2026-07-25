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

import Assignments from "../pages/Assignments";
import BusOverview from "../pages/BusOverview";

import AttendanceHistory from "../pages/AttendanceHistory";

import ChangePassword from "../pages/ChangePassword";

import ForgotPassword from "../pages/ForgotPassword";

import VerifyOtp from "../pages/VerifyOtp";

import PasswordResetSuccess from "../pages/PasswordResetSuccess";

const AppRoutes = () => {
  return (
    <BrowserRouter>

      <Routes>

        {/* Public Route */}
        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/change-password"
          element={
            <ProtectedRoute>
              <ChangePassword />
            </ProtectedRoute>
          }
        />

        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
      />

      <Route
        path="/verify-otp"
        element={<VerifyOtp />}
    />

          <Route
          path="/password-reset-success"
          element={<PasswordResetSuccess />}
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

          <Route
            path="/assignments"
            element={<Assignments />}
          />

          <Route
            path="/bus-overview"
            element={<BusOverview />}
          />

          <Route
            path="/attendance-history"
            element={
              <AttendanceHistory />
            }
          />

        </Route>

      </Routes>

    </BrowserRouter>
  );
};

export default AppRoutes;