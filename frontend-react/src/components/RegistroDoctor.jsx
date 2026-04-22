import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const RegistroDoctor = () => {
    // 1. Estado inicial con el nuevo campo dniDoctor
    const [doctor, setDoctor] = useState({ 
        nombreCompleto: '', 
        dniDoctor: '', 
        correo: '', 
        password: '', 
        especialidad: '' 
    });
    
    const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });
    const [correoError, setCorreoError] = useState(''); 
    const [mostrarPassword, setMostrarPassword] = useState(false); 
    
    const navigate = useNavigate();

    // Función para validar el formato del correo
    const validarCorreo = (correo) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (correo && !regex.test(correo)) {
            setCorreoError('Formato de correo inválido (ej: nombre@clinica.com)');
        } else {
            setCorreoError('');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        // 2. Bloqueo de caracteres raros (Sanitización)
        const caracteresProhibidos = /[<>"';]/g;
        if (caracteresProhibidos.test(value)) {
            setMensaje({ texto: 'No se permiten caracteres especiales como < > " ;', tipo: 'error' });
            return; 
        }

        // 3. Validación de Nombre (Solo letras)
        if (name === 'nombreCompleto') {
            const soloLetras = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]*$/;
            if (!soloLetras.test(value)) {
                setMensaje({ texto: 'El nombre solo puede contener letras.', tipo: 'error' });
                return;
            }
        }

        // 4. Validación de DNI (Solo números)
        if (name === 'dniDoctor') {
            if (!/^\d*$/.test(value)) return;
        }

        setDoctor({ ...doctor, [name]: value });

        if (name === 'correo') {
            validarCorreo(value);
        } else {
            setMensaje({ texto: '', tipo: '' });
        }
    };

    const registrarse = async (e) => {
        e.preventDefault();
        setMensaje({ texto: '', tipo: '' });
        
        // Validaciones finales antes de enviar a Java
        if (correoError) return;
        if (doctor.dniDoctor.length !== 8) {
            setMensaje({ texto: 'El DNI debe tener 8 dígitos.', tipo: 'error' });
            return;
        }
        
        try {
            const respuesta = await axios.post('http://localhost:8080/api/auth/registro', doctor);
            
            if (respuesta.status === 201) {
                setMensaje({ texto: '¡Doctor registrado con éxito! Redirigiendo...', tipo: 'exito' });
                setTimeout(() => navigate('/'), 2000);
            }
        } catch (err) {
            console.error("Error al registrar:", err);
            setMensaje({ texto: 'Ese correo ya está registrado o hubo un error.', tipo: 'error' });
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', backgroundColor: '#fdfdfd', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
            <h2 style={{ textAlign: 'center', color: '#2c3e50' }}>Registrarse como Doctor</h2>
            
            {mensaje.texto && (
                <div style={{ backgroundColor: mensaje.tipo === 'error' ? '#ffebee' : '#e8f5e9', color: mensaje.tipo === 'error' ? '#c62828' : '#2e7d32', padding: '10px', marginBottom: '15px', borderRadius: '4px', textAlign: 'center', fontWeight: 'bold' }}>
                    {mensaje.texto}
                </div>
            )}

            <form onSubmit={registrarse}>
                <label style={{ fontWeight: 'bold' }}>Nombre Completo:</label>
                <input type="text" name="nombreCompleto" value={doctor.nombreCompleto} onChange={handleChange} required style={{width: '100%', marginBottom: '15px', padding: '10px', boxSizing: 'border-box'}} placeholder="Ej: Carlos Mendoza" />

                <label style={{ fontWeight: 'bold' }}>DNI del Doctor:</label>
                <input 
                    type="text" 
                    name="dniDoctor" 
                    value={doctor.dniDoctor} 
                    onChange={handleChange} 
                    maxLength="8" 
                    required 
                    style={{width: '100%', marginBottom: '5px', padding: '10px', boxSizing: 'border-box', border: doctor.dniDoctor.length > 0 && doctor.dniDoctor.length !== 8 ? '2px solid red' : '1px solid #ccc'}} 
                    placeholder="8 dígitos"
                />
                {doctor.dniDoctor.length > 0 && doctor.dniDoctor.length !== 8 && <span style={{color:'red', fontSize:'12px', display:'block', marginBottom:'10px'}}>Debe tener exactamente 8 dígitos</span>}

                <label style={{ fontWeight: 'bold', marginTop: '10px', display: 'block' }}>Correo Institucional:</label>
                <input 
                    type="email" 
                    name="correo" 
                    value={doctor.correo}
                    onChange={handleChange} 
                    required 
                    style={{width: '100%', marginBottom: '5px', padding: '10px', boxSizing: 'border-box', border: correoError ? '2px solid red' : '1px solid #ccc'}} 
                />
                {correoError && <span style={{ color: 'red', fontSize: '12px', display: 'block', marginBottom: '10px' }}>{correoError}</span>}
                
                <label style={{ fontWeight: 'bold', display: 'block', marginTop: '10px' }}>Contraseña:</label>
                <div style={{ position: 'relative', width: '100%', marginBottom: '15px' }}>
                    <input 
                        type={mostrarPassword ? "text" : "password"} 
                        name="password" 
                        value={doctor.password}
                        onChange={handleChange} 
                        required 
                        style={{width: '100%', padding: '10px', boxSizing: 'border-box'}} 
                    />
                    <button 
                        type="button"
                        onClick={() => setMostrarPassword(!mostrarPassword)}
                        style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px' }}
                    >
                        {mostrarPassword ? "🙈" : "👁️"}
                    </button>
                </div>

                <label style={{ fontWeight: 'bold' }}>Especialidad:</label>
                <select name="especialidad" value={doctor.especialidad} onChange={handleChange} required style={{width: '100%', marginBottom: '25px', padding: '10px', boxSizing: 'border-box'}}>
                    <option value="">Seleccione...</option>
                    <option value="Medicina General">Medicina General</option>
                    <option value="Cardiología">Cardiología</option>
                    <option value="Pediatría">Pediatría</option>
                    <option value="Neurología">Neurología</option>
                    <option value="Traumatología">Traumatología</option>
                </select>

                <button 
                    type="submit" 
                    disabled={!!correoError || doctor.dniDoctor.length !== 8}
                    style={{width: '100%', padding: '12px', backgroundColor: (correoError || doctor.dniDoctor.length !== 8) ? '#95a5a6' : '#27ae60', color: 'white', border: 'none', borderRadius: '4px', cursor: (correoError || doctor.dniDoctor.length !== 8) ? 'not-allowed' : 'pointer', fontWeight: 'bold', fontSize: '16px'}}
                >
                    Crear Cuenta
                </button>
            </form>

            <div style={{ textAlign: 'center', marginTop: '15px' }}>
                <Link to="/" style={{ color: '#0056b3', textDecoration: 'none' }}>¿Ya tienes cuenta? Inicia sesión aquí</Link>
            </div>
        </div>
    );
};

export default RegistroDoctor;