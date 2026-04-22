import React, { useState, useEffect } from 'react';
import PacienteService from '../services/PacienteService';

const FormularioPaciente = () => {
    const [nombre, setNombre] = useState('');
    const [apellidoPaterno, setApellidoPaterno] = useState('');
    const [apellidoMaterno, setApellidoMaterno] = useState('');
    const [dni, setDni] = useState('');
    const [edad, setEdad] = useState('');
    const [tipoSangre, setTipoSangre] = useState('');
    const [alergiasConocidas, setAlergiasConocidas] = useState('');
    const [idDoctor, setIdDoctor] = useState('');
    const [dniError, setDniError] = useState('');

    useEffect(() => {
        const doctorGuardado = localStorage.getItem('doctorLogueado');
        if (doctorGuardado) {
            const doctor = JSON.parse(doctorGuardado);
            setIdDoctor(doctor.id);
        }
    }, []);

    // Validación de solo letras y límite de 20 para nombres/apellidos
    const handleTextChange = (valor, setter) => {
        const soloLetras = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]*$/;
        if (soloLetras.test(valor) && valor.length <= 20) {
            setter(valor);
        }
    };

    const handleDniChange = (e) => {
        const valor = e.target.value;
        if (!/^\d*$/.test(valor)) return; 
        setDni(valor);
        setDniError(valor.length > 0 && valor.length !== 8 ? 'El DNI debe tener 8 dígitos.' : '');
    };

   const guardarPaciente = (e) => {
        e.preventDefault();
        if (dni.length !== 8) return;

        // LOS NOMBRES DE AQUÍ DEBEN SER IGUALES A LOS DE JAVA
        const nuevoPaciente = { 
            nombre: nombre, 
            apellidoPaterno: apellidoPaterno, 
            apellidoMaterno: apellidoMaterno, 
            dni: dni, 
            edad: parseInt(edad), 
            tipoSangre: tipoSangre, 
            alergiasConocidas: alergiasConocidas, // <--- Sin guion bajo aquí
            idDoctor: idDoctor 
        };

        PacienteService.registrarPaciente(nuevoPaciente)
            .then(() => {
                alert("¡Paciente registrado!");
                window.location.reload(); 
            })
            .catch(err => console.error("Error al guardar:", err));
    };

    return (
        <div style={{ margin: '20px auto', width: '80%', textAlign: 'left', border: '1px solid #ccc', padding: '20px', borderRadius: '5px', backgroundColor: '#fafafa' }}>
            <h3 style={{ color: '#2c3e50', borderBottom: '2px solid #0056b3', paddingBottom: '10px' }}>Registrar Nuevo Paciente</h3>
            <form onSubmit={guardarPaciente}>
                <div style={{ marginBottom: '10px' }}>
                    <label><strong>Nombre:</strong></label>
                    <input type="text" value={nombre} onChange={(e) => handleTextChange(e.target.value, setNombre)} required style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}/>
                </div>

                <div style={{ display: 'flex', gap: '20px', marginBottom: '10px' }}>
                    <div style={{ flex: 1 }}>
                        <label><strong>Apellido Paterno:</strong></label>
                        <input type="text" value={apellidoPaterno} onChange={(e) => handleTextChange(e.target.value, setApellidoPaterno)} required style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}/>
                    </div>
                    <div style={{ flex: 1 }}>
                        <label><strong>Apellido Materno:</strong></label>
                        <input type="text" value={apellidoMaterno} onChange={(e) => handleTextChange(e.target.value, setApellidoMaterno)} required style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}/>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '20px', marginBottom: '10px' }}>
                    <div style={{ flex: 1 }}>
                        <label><strong>DNI:</strong></label>
                        <input type="text" value={dni} onChange={handleDniChange} maxLength="8" required style={{ width: '100%', padding: '8px', borderRadius: '4px', border: dniError ? '2px solid red' : '1px solid #ccc' }}/>
                        {dniError && <span style={{ color: 'red', fontSize: '11px' }}>{dniError}</span>}
                    </div>
                    <div style={{ flex: 1 }}>
                        <label><strong>Edad:</strong></label>
                        <input type="number" value={edad} onChange={(e) => setEdad(e.target.value)} required style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}/>
                    </div>
                </div>

                <div style={{ marginBottom: '10px' }}>
                    <label><strong>Tipo de Sangre:</strong></label>
                    <select value={tipoSangre} onChange={(e) => setTipoSangre(e.target.value)} required style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}>
                        <option value="">Seleccione...</option>
                        <option value="O+">O+</option><option value="O-">O-</option>
                        <option value="A+">A+</option><option value="A-">A-</option>
                        <option value="B+">B+</option><option value="B-">B-</option>
                    </select>
                </div>

                <div style={{ marginBottom: '10px' }}>
                    <label><strong>Alergias Conocidas:</strong></label>
                    <input type="text" value={alergiasConocidas} onChange={(e) => setAlergiasConocidas(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}/>
                </div>
                
                <button type="submit" disabled={!!dniError || dni.length !== 8} style={{ padding: '12px', backgroundColor: (dniError || dni.length !== 8) ? '#95a5a6' : '#0056b3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', width: '100%', fontWeight: 'bold' }}>
                    Guardar Paciente
                </button>
            </form>
        </div>
    );
};

export default FormularioPaciente;