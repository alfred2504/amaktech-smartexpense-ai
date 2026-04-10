import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { ReactElement } from "react";

interface ProtectedRouteProps {
  children: ReactElement;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, token } = useAuth();

  // Fall back to localStorage in case context hasn't updated yet after login
  const resolvedToken = token || localStorage.getItem("token");
  const resolvedUser = user || localStorage.getItem("user");

  if (!resolvedToken || !resolvedUser) {
    return <Navigate to="/login" replace />;
  }

  return children;
}