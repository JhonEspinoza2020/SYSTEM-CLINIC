import React, { useEffect, useState } from 'react';
import PacienteService from '../services/PacienteService';
import axios from 'axios'; // Importante para la llamada de eliminación

const ListaPacientes = () => {
    const [pacientes, setPacientes] = useState([]);

    useEffect(() => {
        cargarPacientes();
    }, []);

    const cargarPacientes = () => {
        const doctorGuardado = localStorage.getItem('doctorLogueado');
        if (doctorGuardado) {
            const doctor = JSON.parse(doctorGuardado);
            PacienteService.obtenerPacientesPorDoctor(doctor.id)
                .then(respuesta => {
                    setPacientes(respuesta.data);
                })
                .catch(error => {
                    console.error("Hubo un error al obtener los pacientes:", error);
                });
        }
    };

    // --- FUNCIÓN PARA ELIMINAR CON CONFIRMACIÓN ---
    const eliminarPaciente = (id, nombreCompleto) => {
        const confirmar = window.confirm(`¿Estás seguro de que deseas eliminar al paciente ${nombreCompleto}? Esta acción no se puede deshacer.`);
        
        if (confirmar) {
            // Llamamos directamente al endpoint DELETE que creamos en Java
            axios.delete(`http://localhost:8080/api/pacientes/${id}`)
                .then(() => {
                    alert("Paciente eliminado correctamente.");
                    cargarPacientes(); // Recargamos la lista automáticamente
                })
                .catch(error => {
                    console.error("Error al eliminar:", error);
                    alert("No se pudo eliminar el paciente.");
                });
        }
    };

    return (
        <div style={{ margin: '20px auto', width: '95%', textAlign: 'center' }}>
            <h2 style={{ color: '#2c3e50' }}>Panel de Control Clínico - Evaluaciones IA</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
                <thead>
                    <tr style={{ backgroundColor: '#3498db', color: 'white', textAlign: 'center' }}>
                        <th style={{ padding: '12px', border: '1px solid #ddd' }}>DNI</th>
                        <th style={{ padding: '12px', border: '1px solid #ddd' }}>Nombre Completo</th>
                        <th style={{ padding: '12px', border: '1px solid #ddd' }}>Edad</th>
                        <th style={{ padding: '12px', border: '1px solid #ddd' }}>Tipo Sangre</th>
                        <th style={{ padding: '12px', border: '1px solid #ddd' }}>Alergias</th>
                        <th style={{ padding: '12px', border: '1px solid #ddd' }}>Riesgo IA</th>
                        <th style={{ padding: '12px', border: '1px solid #ddd' }}>Recomendación Médica</th>
                        <th style={{ padding: '12px', border: '1px solid #ddd' }}>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {pacientes.length === 0 ? (
                        <tr>
                            <td colSpan="8" style={{ padding: '20px', border: '1px solid #ddd', fontStyle: 'italic', color: '#7f8c8d' }}>
                                No tienes pacientes registrados en tu consultorio aún.
                            </td>
                        </tr>
                    ) : (
                        pacientes.map(paciente => (
                            <tr key={paciente.id} style={{ backgroundColor: 'white', textAlign: 'center' }}>
                                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{paciente.dni}</td>
                                
                                {/* MOSTRANDO NOMBRE + APELLIDOS INTEGRADOS */}
                                <td style={{ padding: '10px', border: '1px solid #ddd', fontWeight: 'bold' }}>
    {/* Unimos los 3 campos de texto */}
    {`${paciente.nombre} ${paciente.apellidoPaterno} ${paciente.apellidoMaterno}`}
</td>

                                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{paciente.edad}</td>
                                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{paciente.tipoSangre}</td>
                                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{paciente.alergiasConocidas}</td>
                                
                                <td style={{ 
                                    padding: '10px', 
                                    border: '1px solid #ddd',
                                    fontWeight: 'bold',
                                    color: paciente.riesgoPredicho === 'ALTO' ? '#c0392b' : 
                                           paciente.riesgoPredicho === 'MEDIO' ? '#e67e22' : '#27ae60'
                                }}>
                                    {paciente.riesgoPredicho}
                                </td>
                                
                                <td style={{ padding: '10px', border: '1px solid #ddd', fontStyle: 'italic', fontSize: '0.9em' }}>
                                    {paciente.recomendacionIa}
                                </td>

                                {/* BOTÓN DE ELIMINAR */}
                                <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                                  <button 
    onClick={() => eliminarPaciente(paciente.id, paciente.nombre)}
    style={{ 
        backgroundColor: '#e74c3c', 
        color: 'white', 
        border: 'none', 
        padding: '8px 12px', 
        borderRadius: '4px', 
        cursor: 'pointer',
        fontWeight: 'bold'
    }}
>
    Eliminar Paciente
</button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default ListaPacientes;