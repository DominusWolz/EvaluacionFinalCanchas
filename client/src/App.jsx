// client/src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CanchasCrud from './pages/CanchasCrud';
import ReservacionesCrud from './pages/ReservacionesCrud';
import ProtectedRoute from './components/ProtectedRoute';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/login" element={<Login />} />

        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />

        <Route path="/canchas" element={
          <ProtectedRoute>
            <CanchasCrud />
          </ProtectedRoute>
        } />

        <Route path="/reservaciones" element={
          <ProtectedRoute>
            <ReservacionesCrud />
          </ProtectedRoute>
        } />

        {/* fallback */}
        <Route path="*" element={<div style={{padding:24}}>Página no encontrada</div>} />

        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>
    </BrowserRouter>
  );
}