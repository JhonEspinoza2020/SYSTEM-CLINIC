import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2'; // <-- IMPORTAMOS SWEETALERT

const Login = () => {
    const [credentials, setCredentials] = useState({ correo: '', password: '', especialidad: '' });
    const [error, setError] = useState('');
    const [correoError, setCorreoError] = useState(''); 
    const [mostrarPassword, setMostrarPassword] = useState(false); 
    const [isLoading, setIsLoading] = useState(false); // <-- ESTADO DE CARGA (SPINNER)
    const navigate = useNavigate();

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
        if (name === 'password') {
            const forbiddenChars = /[<>"';]/g;
            if (forbiddenChars.test(value)) {
                setError("La contraseña contiene caracteres no permitidos.");
                return; 
            }
        }
        setCredentials({ ...credentials, [name]: value });
        if (name === 'correo') validarCorreo(value);
    };

    const iniciarSesion = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true); // <-- ACTIVAMOS EL SPINNER

        try {
            const respuesta = await axios.post('http://localhost:8080/api/auth/login', credentials);
            if (respuesta.status === 200) {
                const doctor = respuesta.data;
                if (doctor.especialidad !== credentials.especialidad) {
                    Swal.fire('Acceso Denegado', `Registrado como ${doctor.especialidad}, no como ${credentials.especialidad}.`, 'error');
                    setError(`Acceso denegado: Registrado como ${doctor.especialidad}, no como ${credentials.especialidad}.`);
                    setIsLoading(false); // Apagamos spinner si hay error
                    return;
                }
                localStorage.setItem('doctorLogueado', JSON.stringify(doctor));
                
                // ALERTA DE ÉXITO MODERNA
                Swal.fire({
                    title: '¡Acceso Autorizado!',
                    text: `Bienvenido(a), Dr(a). ${doctor.nombreCompleto.split(' ')[0]}`,
                    icon: 'success',
                    timer: 1500,
                    showConfirmButton: false
                }).then(() => {
                    navigate('/dashboard');
                });
            }
        } catch (err) {
            Swal.fire('Error de Credenciales', 'Correo o contraseña incorrectos.', 'error');
            setError('Correo o contraseña incorrectos.');
            setIsLoading(false); // <-- APAGAMOS EL SPINNER SI FALLA
        }
    };

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
            
            {/* EL VIDEO DE FONDO */}
            <video 
                autoPlay 
                loop 
                muted 
                playsInline 
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: -2 }}
            >
                <source src="/NovaSalud.mp4" type="video/mp4" />
            </video>

            {/* CAPA OSCURA SUAVE PARA LEER EL TEXTO BLANCO */}
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(10, 20, 30, 0.45)', zIndex: -1 }}></div>

            {/* CAJA DE LOGIN ULTRA TRANSPARENTE (Glassmorphism Puro) */}
            <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '400px', padding: '40px 30px', borderRadius: '20px', backgroundColor: 'rgba(255, 255, 255, 0.10)', boxShadow: '0 20px 40px rgba(0,0,0,0.5)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.2)' }}>
                
                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                    {/* SVG LOGO CORREGIDO - LETRA N CUADRADA */}
                    <svg width="70" height="70" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ margin: '0 auto' }}>
                        <circle cx="50" cy="50" r="45" stroke="#00A8CC" strokeWidth="6"/>
                        <path d="M30 72 V28 L70 72 V28" stroke="#2ecc71" strokeWidth="9" strokeLinecap="square" strokeLinejoin="miter"/>
                    </svg>
                    
                    {/* TEXTO AHORA ES BLANCO PARA RESALTAR */}
                    <h2 style={{ color: '#ffffff', marginTop: '15px', marginBottom: '5px', fontSize: '32px', fontWeight: '800' }}>
                        <span style={{ color: '#00A8CC' }}>Nova</span>Salud
                    </h2>
                    <p style={{ color: '#cfd8dc', margin: 0, fontSize: '14px', fontWeight: 'bold', letterSpacing: '1px' }}>SISTEMA INTELIGENTE</p>
                </div>
                
                {error && <div style={{ backgroundColor: 'rgba(229, 57, 53, 0.8)', color: '#ffffff', padding: '12px', marginBottom: '20px', borderRadius: '8px', textAlign: 'center', fontWeight: 'bold', fontSize: '13px', border: '1px solid rgba(255,255,255,0.3)' }}>{error}</div>}

                <form onSubmit={iniciarSesion}>
                    <label style={labelStyle}>Correo:</label>
                    <input type="email" name="correo" onChange={handleChange} required style={inputStyle(correoError)} placeholder="doctor@novasalud.com" disabled={isLoading} />
                    {correoError && <span style={{ color: '#ff8a80', fontSize: '12px', display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>{correoError}</span>}
                    
                    <label style={labelStyle}>Contraseña:</label>
                    <div style={{ position: 'relative', width: '100%', marginBottom: '15px' }}>
                        <input 
                            type={mostrarPassword ? "text" : "password"} 
                            name="password" 
                            onChange={handleChange} 
                            required 
                            style={{ ...inputStyle(false), marginBottom: 0 }} 
                            disabled={isLoading}
                        />
                        <button 
                            type="button"
                            onClick={() => setMostrarPassword(!mostrarPassword)}
                            disabled={isLoading}
                            style={{ position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', color: '#ffffff' }}
                        >
                            {mostrarPassword ? "🙈" : "👁️"}
                        </button>
                    </div>

                    <label style={labelStyle}>Especialidad:</label>
                    <select name="especialidad" onChange={handleChange} required style={inputStyle(false)} disabled={isLoading}>
                        <option value="" style={{color: '#000'}}>Seleccione su área...</option>
                        <option value="Medicina General" style={{color: '#000'}}>Medicina General</option>
                        <option value="Cardiología" style={{color: '#000'}}>Cardiología</option>
                        <option value="Pediatría" style={{color: '#000'}}>Pediatría</option>
                        <option value="Neurología" style={{color: '#000'}}>Neurología</option>
                        <option value="Traumatología" style={{color: '#000'}}>Traumatología</option>
                    </select>

                    <button type="submit" disabled={!!correoError || isLoading} style={btnSubmitStyle(!!correoError || isLoading)}>
                        {isLoading ? '⏳ VERIFICANDO...' : 'INGRESAR AL SISTEMA'}
                    </button>
                </form>

                <div style={{ textAlign: 'center', marginTop: '25px' }}>
                    <Link to="/registro" style={{ color: '#00A8CC', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px', textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>¿No tienes cuenta? Regístrate aquí</Link>
                </div>
            </div>
            
            {/* INYECCIÓN CSS PARA PLACEHOLDERS */}
            <style>{`
                input::placeholder { color: rgba(255,255,255,0.6); }
            `}</style>
        </div>
    );
};

// Estilos actualizados para textos blancos y cajas transparentes
const labelStyle = { fontWeight: 'bold', color: '#ffffff', fontSize: '13px', display: 'block', marginBottom: '5px', textShadow: '0 1px 2px rgba(0,0,0,0.5)' };
const inputStyle = (error) => ({
    width: '100%', padding: '12px 15px', marginBottom: '15px', boxSizing: 'border-box', 
    border: error ? '2px solid #e53935' : '1px solid rgba(255, 255, 255, 0.4)', borderRadius: '10px', 
    outline: 'none', fontSize: '15px', transition: 'all 0.3s',
    backgroundColor: 'rgba(255, 255, 255, 0.15)', color: '#ffffff' 
});
const btnSubmitStyle = (disabled) => ({
    width: '100%', padding: '15px', marginTop: '10px', 
    backgroundColor: disabled ? 'rgba(255,255,255,0.3)' : '#00A8CC', color: '#ffffff', 
    border: 'none', borderRadius: '10px', cursor: disabled ? 'not-allowed' : 'pointer', 
    fontWeight: '900', fontSize: '15px', letterSpacing: '1px', transition: 'all 0.3s',
    boxShadow: disabled ? 'none' : '0 4px 15px rgba(0, 168, 204, 0.4)'
});

export default Login;