import React, { useState, useEffect } from 'react';
import PacienteService from '../services/PacienteService';

const ListaPacientes = () => {
    // Aquí guardaremos la lista de pacientes que llegue de Java
    const [pacientes, setPacientes] = useState([]);

    // Esto se ejecuta automáticamente cuando la pantalla carga
    useEffect(() => {
        PacienteService.obtenerPacientes()
            .then(respuesta => {
                setPacientes(respuesta.data);
            })
            .catch(error => {
                console.error("Hubo un error al obtener los pacientes:", error);
            });
    }, []);

    return (
        <div style={{ padding: '20px' }}>
            <h2>Lista de Pacientes Registrados</h2>
            
            <table border="1" style={{ margin: '0 auto', width: '80%', textAlign: 'left' }}>
                <thead style={{ backgroundColor: '#f2f2f2' }}>
                    <tr>
                        <th>DNI</th>
                        <th>Nombre Completo</th>
                        <th>Edad</th>
                        <th>Tipo Sangre</th>
                        <th>Alergias</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        pacientes.length === 0 ? (
                            <tr>
                                <td colSpan="5" style={{ textAlign: 'center' }}>No hay pacientes registrados aún.</td>
                            </tr>
                        ) : (
                            pacientes.map(paciente => (
                                <tr key={paciente.id}>
                                    <td>{paciente.dni}</td>
                                    <td>{paciente.nombre}</td>
                                    <td>{paciente.edad}</td>
                                    <td>{paciente.tipoSangre}</td>
                                    <td>{paciente.alergiasConocidas}</td>
                                </tr>
                            ))
                        )
                    }
                </tbody>
            </table>
        </div>
    );
};

export default ListaPacientes;