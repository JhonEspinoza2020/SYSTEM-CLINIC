import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom'; 
import FormularioPaciente from './pages/FormularioPaciente';
import ListaPacientes from './pages/ListaPacientes';
import Login from './pages/Login';
import Registro from './pages/Registro'; 
import RegistroDoctor from './pages/RegistroDoctor';
import RegistroPaciente from './pages/RegistroPaciente'; 
import PerfilDoctor from './pages/PerfilDoctor';
import DashboardPaciente from './pages/DashboardPaciente';
import PanelCitasDoctor from './components/PanelCitasDoctor';
import DashboardAdmin from './pages/DashboardAdmin'; // <-- IMPORTADO EL ADMIN

import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <header className="App-header" style={{ backgroundColor: '#2c3e50', padding: '10px', color: 'white' }}>
          <h2>Sistema de Historias Clínicas</h2>
        </header>
        
        <Routes>
          <Route path="/" element={<Login />} />
          
          {/* RUTAS DE REGISTRO */}
          <Route path="/registro" element={<Registro />} />
          <Route path="/registro-doctor" element={<RegistroDoctor />} />
          <Route path="/registro-paciente" element={<RegistroPaciente />} />
          
          <Route path="/perfil" element={<PerfilDoctor />} />

          {/* PANEL DEL DOCTOR */}
          <Route path="/dashboard" element={
            <div style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', backgroundColor: '#ecf0f1', padding: '15px', borderRadius: '8px' }}>
                  <h3 style={{ margin: 0, color: '#2c3e50' }}>
                      👨‍⚕️ Panel Médico: {JSON.parse(localStorage.getItem('usuarioLogueado') || '{}').nombreCompleto || 'Doctor'}
                  </h3>
                  <div style={{ display: 'flex', gap: '15px' }}>
                      <Link to="/perfil" style={{ padding: '10px 20px', backgroundColor: '#00A8CC', color: 'white', textDecoration: 'none', borderRadius: '5px', fontWeight: 'bold' }}>⚙️ Mi Perfil</Link>
                      
                      {/* 🚀 INTEGRACIÓN: Cierre de sesión limpio con Link */}
                      <Link to="/" onClick={() => { localStorage.removeItem('usuarioLogueado'); localStorage.removeItem('doctorLogueado'); }} style={{ padding: '10px 20px', backgroundColor: '#e74c3c', color: 'white', textDecoration: 'none', borderRadius: '5px', fontWeight: 'bold' }}>Cerrar Sesión</Link>
                  </div>
              </div>
              
              {/* LA NUEVA BANDEJA DE ENTRADA DEL DOCTOR */}
              <PanelCitasDoctor />

              <FormularioPaciente />
              <ListaPacientes />
            </div>
          } />

          {/* PANEL DEL PACIENTE */}
          <Route path="/dashboard-paciente" element={<DashboardPaciente />} />

          {/* PANEL DEL ADMINISTRADOR */}
          <Route path="/dashboard-admin" element={<DashboardAdmin />} />

          {/* RUTA POR DEFECTO PARA SEGURIDAD */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;