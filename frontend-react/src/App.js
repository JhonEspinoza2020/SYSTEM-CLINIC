import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import FormularioPaciente from './pages/FormularioPaciente';
import ListaPacientes from './pages/ListaPacientes';
import Login from './pages/Login';
import Registro from './pages/Registro';
import RegistroDoctor from './pages/RegistroDoctor';
import RegistroPaciente from './pages/RegistroPaciente';
import PerfilDoctor from './pages/PerfilDoctor';
import DashboardPaciente from './pages/DashboardPaciente';
import PanelCitasDoctor from './components/PanelCitasDoctor';
import DashboardAdmin from './pages/DashboardAdmin';
import DoctorDashboardLayout from './components/layout/DoctorDashboardLayout';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function AppShell({ children }) {
  const location = useLocation();
  const isAuthScreen = ['/', '/registro', '/registro-doctor', '/registro-paciente'].includes(location.pathname);

  return (
    <div className="App">
      {isAuthScreen && (
        <header className="App-header" style={{ backgroundColor: '#2c3e50', padding: '10px', color: 'white' }}>
          <h2>Sistema de Historias Clínicas</h2>
        </header>
      )}
      {children}
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppShell>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/registro-doctor" element={<RegistroDoctor />} />
          <Route path="/registro-paciente" element={<RegistroPaciente />} />

          <Route path="/dashboard" element={
            <ProtectedRoute roles={['DOCTOR']}>
              <DoctorDashboardLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="citas" replace />} />
            <Route path="citas" element={<PanelCitasDoctor />} />
            <Route path="registrar" element={<FormularioPaciente />} />
            <Route path="pacientes" element={<ListaPacientes />} />
            <Route path="perfil" element={<PerfilDoctor />} />
          </Route>

          <Route path="/perfil" element={<Navigate to="/dashboard/perfil" replace />} />

          <Route path="/dashboard-paciente" element={
            <ProtectedRoute roles={['PACIENTE']}>
              <DashboardPaciente />
            </ProtectedRoute>
          } />

          <Route path="/dashboard-admin" element={
            <ProtectedRoute roles={['ADMIN']}>
              <DashboardAdmin />
            </ProtectedRoute>
          } />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AppShell>
    </BrowserRouter>
  );
}

export default App;
