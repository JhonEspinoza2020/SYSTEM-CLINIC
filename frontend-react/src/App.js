import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom'; // <-- AÑADÍ Link AQUÍ
import FormularioPaciente from './components/FormularioPaciente';
import ListaPacientes from './components/ListaPacientes';
import Login from './components/Login';
import RegistroDoctor from './components/RegistroDoctor';
import PerfilDoctor from './components/PerfilDoctor';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <header className="App-header" style={{ backgroundColor: '#2c3e50', padding: '10px', color: 'white' }}>
          <h2>Sistema Inteligente de Historias Clínicas</h2>
        </header>
        
        {/* Aquí se define qué pantalla se muestra según la URL */}
        <Routes>
          {/* Ruta por defecto: La pantalla de Login */}
          <Route path="/" element={<Login />} />

          {/* La pantalla de Registro de Doctores */}
          <Route path="/registro" element={<RegistroDoctor />} />

          {/* NUEVA RUTA: La pantalla de Perfil del Doctor */}
          <Route path="/perfil" element={<PerfilDoctor />} />

          {/* Ruta protegida: El Dashboard (Formulario + Tabla) */}
          <Route path="/dashboard" element={
            <div style={{ padding: '20px' }}>
              
              {/* --- CABECERA DEL DOCTOR Y CERRAR SESIÓN --- */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', backgroundColor: '#ecf0f1', padding: '15px', borderRadius: '8px' }}>
                  <h3 style={{ margin: 0, color: '#2c3e50' }}>
                      👨‍⚕️ Bienvenido(a), {JSON.parse(localStorage.getItem('doctorLogueado') || '{}').nombreCompleto || 'Doctor'}
                  </h3>
                  
                  <div style={{ display: 'flex', gap: '15px' }}>
                      {/* BOTÓN NUEVO HACIA EL PERFIL */}
                      <Link to="/perfil" style={{ padding: '10px 20px', backgroundColor: '#00A8CC', color: 'white', textDecoration: 'none', borderRadius: '5px', fontWeight: 'bold' }}>
                          ⚙️ Mi Perfil
                      </Link>

                      {/* BOTÓN CERRAR SESIÓN */}
                      <a href="/" onClick={() => localStorage.removeItem('doctorLogueado')} style={{ padding: '10px 20px', backgroundColor: '#e74c3c', color: 'white', textDecoration: 'none', borderRadius: '5px', fontWeight: 'bold' }}>
                          Cerrar Sesión
                      </a>
                  </div>
              </div>
              
              <FormularioPaciente />
              <ListaPacientes />
            </div>
          } />

          {/* Medida de seguridad: Si ponen una URL rara, los regresa al login */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;