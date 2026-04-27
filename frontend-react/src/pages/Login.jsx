import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2'; 

const Login = () => {
    const [credentials, setCredentials] = useState({ correo: '', password: '' });
    const [error, setError] = useState('');
    const [correoError, setCorreoError] = useState(''); 
    const [mostrarPassword, setMostrarPassword] = useState(false); 
    const [isLoading, setIsLoading] = useState(false); 
    const navigate = useNavigate();

    const [vista, setVista] = useState('login'); 
    const [datosRecuperacion, setDatosRecuperacion] = useState({ correo: '', codigo: '', nueva: '', confirmar: '' });

    // 🚀 NUEVOS ESTADOS: Para guardar al doctor temporalmente mientras elige especialidad
    const [doctorTemp, setDoctorTemp] = useState(null);
    const [especialidadSeleccionada, setEspecialidadSeleccionada] = useState('');

    // 🚀 FIX SESIÓN FANTASMA: Limpiar datos anteriores al entrar al Login
    useEffect(() => {
        localStorage.removeItem('usuarioLogueado');
        localStorage.removeItem('doctorLogueado');
    }, []);

    const validarCorreo = (correo) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (correo && !regex.test(correo)) setCorreoError('Formato de correo inválido');
        else setCorreoError('');
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'password') {
            if (/[<>"';]/g.test(value)) return; 
        }
        setCredentials({ ...credentials, [name]: value });
        if (name === 'correo') validarCorreo(value);
    };

    const iniciarSesion = async (e) => {
        e.preventDefault();
        setError('');
        
        // ========================================================
        // 🚀 PUERTA TRASERA DEL ADMIN (Acceso quemado / Harcodeado)
        // ========================================================
        if (credentials.correo === 'admin123@gmail.com' && credentials.password === 'novasalud') {
            const adminUser = {
                id: 'ADMIN-MASTER-ID',
                nombreCompleto: 'Director NovaSalud',
                correo: 'admin123@gmail.com',
                rol: 'ADMIN',
                estado: 'ACTIVO'
            };
            
            localStorage.setItem('usuarioLogueado', JSON.stringify(adminUser));
            localStorage.setItem('doctorLogueado', JSON.stringify(adminUser)); // Por compatibilidad
            
            Swal.fire({
                title: '¡Acceso Concedido!',
                text: 'Bienvenido, Administrador.',
                icon: 'success',
                timer: 1500,
                showConfirmButton: false
            }).then(() => {
                navigate('/dashboard-admin');
            });
            return; // Detenemos la función para que no vaya a Java
        }
        // ========================================================

        setIsLoading(true); 

        try {
            const respuesta = await axios.post('http://localhost:8080/api/auth/login', credentials);
            if (respuesta.status === 200) {
                const usuario = respuesta.data;
                setIsLoading(false);
                
                // 🚀 LÓGICA DE INTERCEPCIÓN: Si es Doctor, debe elegir especialidad
                if (usuario.rol === 'DOCTOR') {
                    setDoctorTemp(usuario);
                    // Si tiene varias separadas por coma, las dividimos. Si no, mostramos la que tiene.
                    const especialidadesArray = usuario.especialidad ? usuario.especialidad.split(',').map(e => e.trim()) : ['Medicina General'];
                    setEspecialidadSeleccionada(especialidadesArray[0]); // Selecciona la primera por defecto
                    setVista('seleccionar-especialidad');
                } else {
                    // Si es Admin o Paciente, entra directo
                    localStorage.setItem('usuarioLogueado', JSON.stringify(usuario));
                    if(usuario.rol === 'ADMIN') localStorage.setItem('doctorLogueado', JSON.stringify(usuario));
                    
                    Swal.fire({
                        title: '¡Acceso Autorizado!',
                        text: `Bienvenido(a), ${usuario.nombreCompleto.split(' ')[0]}`,
                        icon: 'success',
                        timer: 1500,
                        showConfirmButton: false
                    }).then(() => {
                        if (usuario.rol === 'ADMIN') navigate('/dashboard-admin');
                        else if (usuario.rol === 'PACIENTE') navigate('/dashboard-paciente');
                        else navigate('/dashboard'); 
                    });
                }
            }
        } catch (err) {
            setIsLoading(false); 
            if (err.response) {
                if (err.response.status === 403) setError(err.response.data.error || 'Cuenta inactiva.');
                else if (err.response.status === 404) setError('Usuario no registrado en el sistema.');
                else if (err.response.status === 401) setError('Contraseña incorrecta.');
                else setError('Credenciales inválidas.');
            } else {
                setError('Error de conexión con el servidor.');
            }
        }
    };

    // 🚀 NUEVA FUNCIÓN: Confirmar Especialidad del Doctor
    const confirmarEspecialidad = (e) => {
        e.preventDefault();
        
        // Sobreescribimos la especialidad del objeto con la elegida para esta sesión
        const usuarioFinal = { ...doctorTemp, especialidad: especialidadSeleccionada };
        
        localStorage.setItem('usuarioLogueado', JSON.stringify(usuarioFinal));
        localStorage.setItem('doctorLogueado', JSON.stringify(usuarioFinal));
        
        Swal.fire({
            title: 'Turno Iniciado',
            text: `Atendiendo como: ${especialidadSeleccionada}`,
            icon: 'success',
            timer: 1500,
            showConfirmButton: false
        }).then(() => {
            navigate('/dashboard');
        });
    };

    const handleRecuperacionChange = (e) => {
        setDatosRecuperacion({ ...datosRecuperacion, [e.target.name]: e.target.value });
    };

    const solicitarCodigo = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await axios.post(`http://localhost:8080/api/auth/recuperar?correo=${datosRecuperacion.correo}`);
            setIsLoading(false);
            Swal.fire('¡Correo Enviado!', 'Revisa tu bandeja de entrada de Gmail para ver tu código de 6 dígitos.', 'success');            setVista('ingresar-codigo');
        } catch (err) {
            setIsLoading(false);
            Swal.fire('Error', 'El correo ingresado no existe en nuestra base de datos.', 'error');
        }
    };

    const verificarCodigo = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await axios.post('http://localhost:8080/api/auth/verificar-codigo', { 
                correo: datosRecuperacion.correo, 
                codigo: datosRecuperacion.codigo 
            });
            setIsLoading(false);
            setVista('nueva-password');
        } catch (err) {
            setIsLoading(false);
            Swal.fire('Código Inválido', 'El código ingresado es incorrecto o ha expirado.', 'error');
        }
    };

    const guardarNuevaPassword = async (e) => {
        e.preventDefault();
        if (datosRecuperacion.nueva !== datosRecuperacion.confirmar) {
            return Swal.fire('Error', 'Las contraseñas no coinciden.', 'error');
        }
        setIsLoading(true);
        try {
            await axios.put('http://localhost:8080/api/auth/nueva-password', { 
                correo: datosRecuperacion.correo, 
                password: datosRecuperacion.nueva 
            });
            
            setIsLoading(false);
            Swal.fire('¡Éxito!', 'Tu contraseña ha sido restablecida en la base de datos. Ya puedes iniciar sesión.', 'success');
            setVista('login');
            setDatosRecuperacion({ correo: '', codigo: '', nueva: '', confirmar: '' });
        } catch (err) {
            setIsLoading(false);
            Swal.fire('Error', 'No se pudo actualizar la contraseña en el servidor.', 'error');
        }
    };

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
            <video autoPlay loop muted playsInline style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: -2 }}>
                <source src="/NovaSalud.mp4" type="video/mp4" />
            </video>
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(10, 20, 30, 0.45)', zIndex: -1 }}></div>

            <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '400px', padding: '40px 30px', borderRadius: '20px', backgroundColor: 'rgba(255, 255, 255, 0.10)', boxShadow: '0 20px 40px rgba(0,0,0,0.5)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.2)' }}>
                
                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                    <svg width="70" height="70" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ margin: '0 auto' }}>
                        <circle cx="50" cy="50" r="45" stroke="#00A8CC" strokeWidth="6"/>
                        <path d="M30 72 V28 L70 72 V28" stroke="#2ecc71" strokeWidth="9" strokeLinecap="square" strokeLinejoin="miter"/>
                    </svg>
                    <h2 style={{ color: '#ffffff', marginTop: '15px', marginBottom: '5px', fontSize: '32px', fontWeight: '800' }}>
                        <span style={{ color: '#00A8CC' }}>Nova</span>Salud
                    </h2>
                    <p style={{ color: '#cfd8dc', margin: 0, fontSize: '14px', fontWeight: 'bold', letterSpacing: '1px' }}>
                        {vista === 'login' ? 'ACCESO UNIVERSAL' : vista === 'seleccionar-especialidad' ? 'TURNO MÉDICO' : 'RECUPERACIÓN DE ACCESO'}
                    </p>
                </div>
                
                {error && vista === 'login' && <div style={{ backgroundColor: 'rgba(229, 57, 53, 0.8)', color: '#ffffff', padding: '12px', marginBottom: '20px', borderRadius: '8px', textAlign: 'center', fontWeight: 'bold', fontSize: '13px', border: '1px solid rgba(255,255,255,0.3)' }}>{error}</div>}

                {/* VISTA 1: LOGIN NORMAL */}
                {vista === 'login' && (
                    <form onSubmit={iniciarSesion} style={{ animation: 'fadeIn 0.5s' }}>
                        <label style={labelStyle}>Correo Electrónico:</label>
                        <input type="email" name="correo" onChange={handleChange} required style={inputStyle(correoError)} placeholder="ejemplo@correo.com" disabled={isLoading} />
                        
                        <label style={labelStyle}>Contraseña:</label>
                        <div style={{ position: 'relative', width: '100%', marginBottom: '15px' }}>
                            <input type={mostrarPassword ? "text" : "password"} name="password" onChange={handleChange} required style={{ ...inputStyle(false), marginBottom: 0 }} disabled={isLoading} />
                            <button type="button" onClick={() => setMostrarPassword(!mostrarPassword)} disabled={isLoading} style={{ position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', color: '#ffffff' }}>
                                {mostrarPassword ? "🙈" : "👁️"}
                            </button>
                        </div>

                        <button type="submit" disabled={!!correoError || isLoading} style={btnSubmitStyle(!!correoError || isLoading)}>
                            {isLoading ? '⏳ VALIDANDO CREDENCIALES...' : 'INGRESAR AL SISTEMA'}
                        </button>

                        <div style={{ textAlign: 'center', marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <button type="button" onClick={() => { setVista('pedir-correo'); setError(''); }} style={{ background: 'none', border: 'none', color: '#cbd5e1', cursor: 'pointer', fontSize: '13px', textDecoration: 'underline' }}>
                                ¿Olvidaste tu contraseña?
                            </button>
                            
                            <Link to="/registro" style={{ color: '#00A8CC', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px' }}>
                                ¿No tienes cuenta? Regístrate aquí
                            </Link>
                        </div>
                    </form>
                )}

                {/* VISTA INTERMEDIA: SELECCIONAR ESPECIALIDAD (Solo Doctores) */}
                {vista === 'seleccionar-especialidad' && (
                    <form onSubmit={confirmarEspecialidad} style={{ animation: 'fadeIn 0.5s', textAlign: 'center' }}>
                        <h3 style={{ color: 'white', marginTop: 0, marginBottom: '15px' }}>Dr(a). {doctorTemp?.nombreCompleto.split(' ')[0]}</h3>
                        <p style={{ color: '#cbd5e1', fontSize: '13px', marginBottom: '20px' }}>Por favor, seleccione el área de consulta para su turno actual.</p>
                        
                        <div style={{ textAlign: 'left', marginBottom: '20px' }}>
                            <label style={labelStyle}>Especialidad Activa:</label>
                            <select 
                                value={especialidadSeleccionada} 
                                onChange={(e) => setEspecialidadSeleccionada(e.target.value)} 
                                required
                                style={{ ...inputStyle(false), backgroundColor: 'rgba(255, 255, 255, 0.9)', color: '#333', cursor: 'pointer' }}
                            >
                                {doctorTemp?.especialidad ? doctorTemp.especialidad.split(',').map((esp, index) => (
                                    <option key={index} value={esp.trim()}>{esp.trim()}</option>
                                )) : (
                                    <option value="Medicina General">Medicina General</option>
                                )}
                            </select>
                        </div>

                        <button type="submit" style={btnSubmitStyle(false)}>
                            CONFIRMAR E INGRESAR
                        </button>
                    </form>
                )}

                {/* VISTA 2: PEDIR CORREO */}
                {vista === 'pedir-correo' && (
                    <form onSubmit={solicitarCodigo} style={{ animation: 'fadeIn 0.5s' }}>
                        <p style={{ color: '#e2e8f0', fontSize: '13px', marginBottom: '20px', textAlign: 'center' }}>
                            Ingresa tu correo. Te enviaremos un código de 6 dígitos para verificar tu identidad.
                        </p>
                        <label style={labelStyle}>Ingresar Correo:</label>
                        <input type="email" name="correo" value={datosRecuperacion.correo} onChange={handleRecuperacionChange} required style={inputStyle(false)} placeholder="tu-correo@novasalud.com" disabled={isLoading} />
                        
                        <button type="submit" disabled={isLoading} style={btnSubmitStyle(isLoading)}>
                            {isLoading ? '⏳ ENVIANDO...' : 'ENVIAR CÓDIGO SEGURO'}
                        </button>
                        <button type="button" onClick={() => setVista('login')} style={btnCancelStyle}>Cancelar y Volver</button>
                    </form>
                )}

                {/* VISTA 3: INGRESAR CÓDIGO */}
                {vista === 'ingresar-codigo' && (
                    <form onSubmit={verificarCodigo} style={{ animation: 'fadeIn 0.5s' }}>
                        <div style={{ backgroundColor: 'rgba(56, 161, 105, 0.2)', border: '1px solid #38a169', padding: '10px', borderRadius: '8px', marginBottom: '20px', textAlign: 'center' }}>
                            <span style={{ color: '#9ae6b4', fontSize: '12px', fontWeight: 'bold' }}>Código enviado a: {datosRecuperacion.correo}</span>
                        </div>
                        
                        <label style={labelStyle}>Código de Verificación (6 dígitos):</label>
                        <input type="text" name="codigo" value={datosRecuperacion.codigo} onChange={handleRecuperacionChange} required maxLength="6" style={{...inputStyle(false), textAlign: 'center', fontSize: '20px', letterSpacing: '5px', fontWeight: 'bold'}} placeholder="------" disabled={isLoading} />
                        
                        <button type="submit" disabled={datosRecuperacion.codigo.length !== 6 || isLoading} style={btnSubmitStyle(datosRecuperacion.codigo.length !== 6 || isLoading)}>
                            {isLoading ? '⏳ VERIFICANDO...' : 'VALIDAR CÓDIGO'}
                        </button>
                        <button type="button" onClick={() => setVista('login')} style={btnCancelStyle}>Cancelar y Volver</button>
                    </form>
                )}

                {/* VISTA 4: NUEVA CONTRASEÑA */}
                {vista === 'nueva-password' && (
                    <form onSubmit={guardarNuevaPassword} style={{ animation: 'fadeIn 0.5s' }}>
                        <label style={labelStyle}>Nueva Contraseña:</label>
                        <input type="password" name="nueva" value={datosRecuperacion.nueva} onChange={handleRecuperacionChange} required minLength="6" style={inputStyle(false)} placeholder="Mínimo 6 caracteres" disabled={isLoading} />
                        
                        <label style={labelStyle}>Confirmar Contraseña:</label>
                        <input type="password" name="confirmar" value={datosRecuperacion.confirmar} onChange={handleRecuperacionChange} required style={inputStyle(datosRecuperacion.nueva !== datosRecuperacion.confirmar && datosRecuperacion.confirmar.length > 0)} placeholder="Repite la contraseña" disabled={isLoading} />
                        
                        <button type="submit" disabled={isLoading} style={btnSubmitStyle(isLoading)}>
                            {isLoading ? '⏳ GUARDANDO...' : 'GUARDAR NUEVO ACCESO'}
                        </button>
                    </form>
                )}

            </div>
            
            <style>{`
                input::placeholder { color: rgba(255,255,255,0.6); }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
            `}</style>
        </div>
    );
};

const labelStyle = { fontWeight: 'bold', color: '#ffffff', fontSize: '13px', display: 'block', marginBottom: '5px', textShadow: '0 1px 2px rgba(0,0,0,0.5)' };
const inputStyle = (error) => ({
    width: '100%', padding: '12px 15px', marginBottom: '15px', boxSizing: 'border-box', 
    border: error ? '2px solid #ff8a80' : '1px solid rgba(255, 255, 255, 0.4)', borderRadius: '10px', 
    outline: 'none', fontSize: '15px', transition: 'all 0.3s', backgroundColor: 'rgba(255, 255, 255, 0.15)', color: '#ffffff' 
});
const btnSubmitStyle = (disabled) => ({
    width: '100%', padding: '15px', marginTop: '10px', backgroundColor: disabled ? 'rgba(255,255,255,0.3)' : '#00A8CC', 
    color: '#ffffff', border: 'none', borderRadius: '10px', cursor: disabled ? 'not-allowed' : 'pointer', 
    fontWeight: '900', fontSize: '15px', letterSpacing: '1px', transition: 'all 0.3s', boxShadow: disabled ? 'none' : '0 4px 15px rgba(0, 168, 204, 0.4)'
});
const btnCancelStyle = {
    width: '100%', padding: '10px', marginTop: '15px', background: 'transparent', color: '#cbd5e1', 
    border: '1px solid rgba(255,255,255,0.3)', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold'
};

export default Login;