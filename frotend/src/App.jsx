import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import EmployerDashboard from './pages/EmployerDashboard';
import HRDashboard from './pages/HRDashboard';
import CallRoom from './pages/CallRoom';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';

function RequireAuth({ children, role }) {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('role');
  const location = useLocation();
  if (!token) return <Navigate to="/login" state={{ from: location }} replace />;
  if (role && userRole !== role) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/admin" element={<RequireAuth role="admin"><AdminDashboard /></RequireAuth>} />
      <Route path="/employer" element={<RequireAuth role="employer"><EmployerDashboard /></RequireAuth>} />
      <Route path="/hr" element={<RequireAuth role="hr"><HRDashboard /></RequireAuth>} />
      <Route path="/call-room/:id" element={<RequireAuth><CallRoom /></RequireAuth>} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
