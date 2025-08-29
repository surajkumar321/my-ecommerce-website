// client/src/components/AdminProtectedRoute.js
import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function ProtectedRoute({ children, admin = false }) {
  const { user } = useSelector((s) => s.auth) || {};

  const ls = (() => {
    try { return JSON.parse(localStorage.getItem("auth")) || null; } catch { return null; }
  })();
  const effectiveUser = user || ls?.user || null;

  if (!effectiveUser) return <Navigate to="/admin" replace />; // your admin login route
  if (admin && !effectiveUser.isAdmin) return <Navigate to="/" replace />;
  return children;
}
