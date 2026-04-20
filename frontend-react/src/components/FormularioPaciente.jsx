import React, { useState } from 'react';
import PacienteService from '../services/PacienteService';

const FormularioPaciente = () => {
    // Variables para guardar lo que el usuario escribe
    const [nombre, setNombre] = useState('');
    const [dni, setDni] = useState('');
    const [edad, setEdad] = useState('');
    const [tipoSangre, setTipoSangre] = useState('');
    const [alergiasConocidas, setAlergiasConocidas] = useState('');

    // Función que se ejecuta al darle clic a "Guardar"
    const guardarPaciente = (e) => {
        e.preventDefault(); // Evita que la página parpadee o se recargue mal

        // Armamos el objeto con los datos del paciente
        const nuevoPaciente = { nombre, dni, edad, tipoSangre, alergiasConocidas };

        // Llamamos al servicio para enviarlo a Java
        PacienteService.registrarPaciente(nuevoPaciente)
            .then(respuesta => {
                alert("¡Paciente registrado con éxito en la base de datos!");
                window.location.reload(); // Recargamos la página para ver la tabla actualizada
            })
            .catch(error => {
                console.error("Hubo un error:", error);
                alert("Error al registrar el paciente.");
            });
    };

    return (
        <div style={{ margin: '20px auto', width: '80%', textAlign: 'left', border: '1px solid #ccc', padding: '20px', borderRadius: '5px', backgroundColor: '#fafafa' }}>
            <h3>Registrar Nuevo Paciente</h3>
            <form onSubmit={guardarPaciente}>
                <div style={{ marginBottom: '10px' }}>
                    <label><strong>Nombre Completo:</strong></label><br />
                    <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required style={{ width: '100%', padding: '5px' }}/>
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <label><strong>DNI:</strong></label><br />
                    <input type="text" value={dni} onChange={(e) => setDni(e.target.value)} required style={{ width: '100%', padding: '5px' }}/>
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <label><strong>Edad:</strong></label><br />
                    <input type="number" value={edad} onChange={(e) => setEdad(e.target.value)} required style={{ width: '100%', padding: '5px' }}/>
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <label><strong>Tipo de Sangre:</strong></label><br />
                    <input type="text" value={tipoSangre} onChange={(e) => setTipoSangre(e.target.value)} style={{ width: '100%', padding: '5px' }} placeholder="Ej: O+, A-"/>
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <label><strong>Alergias Conocidas:</strong></label><br />
                    <input type="text" value={alergiasConocidas} onChange={(e) => setAlergiasConocidas(e.target.value)} style={{ width: '100%', padding: '5px' }} placeholder="Ej: Penicilina, Ninguna"/>
                </div>
                
                <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#0056b3', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer', marginTop: '10px' }}>
                    Guardar Paciente
                </button>
            </form>
        </div>
    );
};

export default FormularioPaciente;