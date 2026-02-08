import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, roles }) {
  const { loading, isAuthed, role } = useAuth();

  if (loading) return <div className="container"><p>Loading...</p></div>;
  if (!isAuthed) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(role)) return <Navigate to="/" replace />;

  return children;
}
