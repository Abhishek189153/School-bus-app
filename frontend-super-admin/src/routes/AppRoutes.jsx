import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";

import MainLayout from "../layouts/MainLayout";

import Login from "../pages/Login";

import Dashboard from "../pages/Dashboard";

import Schools from "../pages/Schools";

import SchoolAdmins from "../pages/SchoolAdmins";

import Settings from "../pages/Settings";

import ForgotPassword from "../pages/ForgotPassword";
import VerifyOtp from "../pages/VerifyOtp";
import PasswordResetSuccess from "../pages/PasswordResetSuccess";
import ChangePassword from "../pages/ChangePassword";


export default function AppRoutes() {

  return (

    <Routes>

      {/* Login */}

      <Route
        path="/login"
        element={<Login />}
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

      <Route 
          path="/change-password"
          element={
            <ProtectedRoute>
              <ChangePassword />
            </ProtectedRoute>
          }
        />

      {/* Protected Routes */}

      <Route

        path="/"

        element={
          <ProtectedRoute>

            <MainLayout />

          </ProtectedRoute>
        }

      >

        <Route
          index
          element={<Dashboard />}
        />

        <Route
          path="schools"
          element={<Schools />}
        />

        <Route
          path="school-admins"
          element={<SchoolAdmins />}
        />

        <Route
          path="settings"
          element={<Settings />}
        />

      </Route>

      <Route

        path="*"

        element={
          <Navigate
            to="/"
            replace
          />
        }

      />

    </Routes>

  );

}