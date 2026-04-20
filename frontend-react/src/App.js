import React from 'react';
import './App.css';
import ListaPacientes from './components/ListaPacientes';
import FormularioPaciente from './components/FormularioPaciente'; // Importamos el formulario

function App() {
  return (
    <div className="App">
      <h1>Dashboard Sistema Clínica</h1>
      <p>Bienvenido, Dr. Jhon Mendoza</p>
      
      <hr style={{ margin: '30px 0' }} />
      
      {/* 1. Mostramos el formulario de registro arriba */}
      <FormularioPaciente />

      <br />
      
      {/* 2. Mostramos la tabla abajo */}
      <ListaPacientes />
    </div>
  );
}

export default App;