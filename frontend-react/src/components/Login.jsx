import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
    const [credentials, setCredentials] = useState({ correo: '', password: '', especialidad: '' });
    const [error, setError] = useState('');
    const [correoError, setCorreoError] = useState(''); // Estado para el error del correo en tiempo real
    const [mostrarPassword, setMostrarPassword] = useState(false); // Estado para el "ojito"
    const navigate = useNavigate();

    // Validación de correo en tiempo real
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

        // Si es password, bloqueamos caracteres raros en tiempo real
        if (name === 'password') {
            const forbiddenChars = /[<>"';]/g;
            if (forbiddenChars.test(value)) {
                setError("La contraseña contiene caracteres no permitidos.");
                return; // No actualiza el estado si hay caracteres prohibidos
            }
        }

        setCredentials({ ...credentials, [name]: value });
        if (name === 'correo') validarCorreo(value);
    };

    const iniciarSesion = async (e) => {
        e.preventDefault();
        setError('');
        
        try {
            const respuesta = await axios.post('http://localhost:8080/api/auth/login', credentials);
            
            if (respuesta.status === 200) {
                const doctor = respuesta.data;

                // --- VALIDACIÓN DE ROL/ESPECIALIDAD ---
                // Verificamos que la especialidad elegida en el SELECT coincida con la de la BD
                if (doctor.especialidad !== credentials.especialidad) {
                    setError(`Acceso denegado: Usted está registrado como ${doctor.especialidad}, no como ${credentials.especialidad}.`);
                    return;
                }

                localStorage.setItem('doctorLogueado', JSON.stringify(doctor));
                navigate('/dashboard');
            }
        } catch (err) {
            setError('Correo o contraseña incorrectos.');
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', backgroundColor: '#fdfdfd', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
            <h2 style={{ textAlign: 'center', color: '#2c3e50' }}>Acceso para Doctores</h2>
            
            {error && <div style={{ backgroundColor: '#ffebee', color: '#c62828', padding: '10px', marginBottom: '15px', borderRadius: '4px', textAlign: 'center', fontWeight: 'bold' }}>{error}</div>}

            <form onSubmit={iniciarSesion}>
                <label style={{ fontWeight: 'bold' }}>Correo Institucional:</label>
                <input type="email" name="correo" onChange={handleChange} required style={{width: '100%', marginBottom: '5px', padding: '10px', boxSizing: 'border-box', border: correoError ? '2px solid red' : '1px solid #ccc'}} />
                {correoError && <span style={{ color: 'red', fontSize: '12px', display: 'block', marginBottom: '10px' }}>{correoError}</span>}
                
                <label style={{ fontWeight: 'bold', display: 'block', marginTop: '10px' }}>Contraseña:</label>
                <div style={{ position: 'relative', width: '100%', marginBottom: '15px' }}>
                    <input 
                        type={mostrarPassword ? "text" : "password"} 
                        name="password" 
                        onChange={handleChange} 
                        required 
                        style={{width: '100%', padding: '10px', boxSizing: 'border-box'}} 
                    />
                    {/* El botón del ojito */}
                    <button 
                        type="button"
                        onClick={() => setMostrarPassword(!mostrarPassword)}
                        style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px' }}
                    >
                        {mostrarPassword ? "🙈" : "👁️"}
                    </button>
                </div>

                <label style={{ fontWeight: 'bold' }}>Especialidad:</label>
                <select name="especialidad" onChange={handleChange} required style={{width: '100%', marginBottom: '25px', padding: '10px', boxSizing: 'border-box'}}>
                    <option value="">Seleccione...</option>
                    <option value="Medicina General">Medicina General</option>
                    <option value="Cardiología">Cardiología</option>
                    <option value="Pediatría">Pediatría</option>
                    <option value="Neurología">Neurología</option>
                    <option value="Traumatología">Traumatología</option>
                </select>

                <button type="submit" disabled={!!correoError} style={{width: '100%', padding: '12px', backgroundColor: correoError ? '#95a5a6' : '#0056b3', color: 'white', border: 'none', borderRadius: '4px', cursor: correoError ? 'not-allowed' : 'pointer', fontWeight: 'bold', fontSize: '16px'}}>
                    Entrar al Sistema
                </button>
            </form>
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <Link to="/registro" style={{ color: '#0056b3', textDecoration: 'none', fontWeight: 'bold' }}>¿Eres nuevo doctor? Registrarse</Link>
            </div>
        </div>
    );
};

export default Login;