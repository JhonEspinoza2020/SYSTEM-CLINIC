import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

const RegistroPaciente = () => {
    const navigate = useNavigate();
    const [paciente, setPaciente] = useState({ nombreCompleto: '', dni: '', correo: '', password: '', confirmarPassword: '' });
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setPaciente({ ...paciente, [e.target.name]: e.target.value });
    };

    const registrar = async (e) => {
        e.preventDefault();
        
        // VALIDACIONES INTACTAS
        if (paciente.dni.length !== 8 || !/^\d+$/.test(paciente.dni)) {
            return Swal.fire('Error de Documento', 'El DNI debe tener exactamente 8 dígitos numéricos.', 'warning');
        }
        if (paciente.password.length < 8) {
            return Swal.fire('Seguridad Débil', 'La contraseña debe tener al menos 8 caracteres.', 'warning');
        }
        if (paciente.password !== paciente.confirmarPassword) {
            return Swal.fire('Error', 'Las contraseñas no coinciden.', 'error');
        }

        setIsLoading(true);
        try {
            const payload = { 
                nombreCompleto: paciente.nombreCompleto,
                correo: paciente.correo,
                password: paciente.password,
                dniDoctor: paciente.dni, 
                rol: 'PACIENTE', 
                estado: 'ACTIVO' 
            }; 

            await axios.post('http://localhost:8080/api/auth/registro', payload);
            
            Swal.fire({
                title: '¡Registro Exitoso!',
                text: 'Tu historial médico digital ha sido creado. Ya puedes iniciar sesión.',
                icon: 'success',
                confirmButtonColor: '#00A8CC'
            }).then(() => { navigate('/'); });
            
        } catch (err) {
            const mensajeError = typeof err.response?.data === 'string' ? err.response.data : 'Error al registrar la cuenta.';
            Swal.fire('Error', mensajeError, 'error');
            setIsLoading(false);
        }
    };

    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: '#0f172a', padding: '40px 0', fontFamily: 'system-ui, sans-serif' }}>
            <style>{`
                @keyframes fadeZoom { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
                .animar-card { animation: fadeZoom 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
                input::placeholder { color: rgba(255,255,255,0.3); }
            `}</style>
            
            <div className="animar-card" style={{ width: '100%', maxWidth: '480px', background: 'rgba(255,255,255,0.03)', padding: '45px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)', backdropFilter: 'blur(10px)' }}>
                
                <div style={{ textAlign: 'center', marginBottom: '35px' }}>
                    <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#00A8CC" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '10px' }}>
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                    <h2 style={{ color: 'white', margin: 0, fontSize: '28px', fontWeight: '800', letterSpacing: '0.5px' }}>Registro <span style={{color: '#00A8CC'}}>Paciente</span></h2>
                    <p style={{ color: '#94a3b8', fontSize: '13px', marginTop: '8px' }}>Crea tu cuenta segura en NovaSalud</p>
                </div>
                
                <form onSubmit={registrar}>
                    <label style={labelStyle}>Nombres y Apellidos Completos</label>
                    <input type="text" name="nombreCompleto" placeholder="Como aparece en tu documento" onChange={handleChange} required style={inputStyle} disabled={isLoading} />
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                        <div>
                            <label style={labelStyle}>Identidad (DNI)</label>
                            <input type="text" name="dni" placeholder="8 dígitos" maxLength="8" onChange={handleChange} required style={inputStyle} disabled={isLoading} />
                        </div>
                        <div>
                            <label style={labelStyle}>Correo Electrónico</label>
                            <input type="email" name="correo" placeholder="correo@gmail.com" onChange={handleChange} required style={inputStyle} disabled={isLoading} />
                        </div>
                    </div>

                    <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '20px', borderRadius: '12px', marginBottom: '25px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <label style={{ color: '#00A8CC', fontWeight: '700', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '15px' }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                            Seguridad de la Cuenta
                        </label>
                        
                        <label style={labelStyle}>Crear Contraseña</label>
                        <input type="password" name="password" placeholder="Mínimo 8 caracteres" onChange={handleChange} required style={{...inputStyle, marginBottom: '15px'}} disabled={isLoading} />
                        
                        <label style={labelStyle}>Confirmar Contraseña</label>
                        <input type="password" name="confirmarPassword" placeholder="Repite la contraseña" onChange={handleChange} required style={{...inputStyle, marginBottom: '0'}} disabled={isLoading} />
                    </div>
                    
                    <button type="submit" disabled={isLoading} style={btnSubmitStyle(isLoading)}>
                        {isLoading ? 'CREANDO HISTORIAL...' : 'CREAR CUENTA AHORA'}
                    </button>
                </form>

                <div style={{ textAlign: 'center', marginTop: '25px' }}>
                    <Link to="/registro" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '13px', fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '5px', transition: '0.3s' }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                        Regresar
                    </Link>
                </div>
            </div>
        </div>
    );
};

const labelStyle = { color: '#94a3b8', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '8px' };
const inputStyle = { width: '100%', padding: '14px', marginBottom: '20px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(15, 23, 42, 0.6)', color: 'white', boxSizing: 'border-box', fontSize: '14px', outline: 'none', transition: '0.3s' };
const btnSubmitStyle = (disabled) => ({ width: '100%', padding: '16px', background: disabled ? 'rgba(0, 168, 204, 0.5)' : '#00A8CC', color: 'white', border: 'none', borderRadius: '10px', fontWeight: '800', cursor: disabled ? 'not-allowed' : 'pointer', fontSize: '14px', letterSpacing: '1px', transition: '0.3s', boxShadow: disabled ? 'none' : '0 10px 15px -3px rgba(0, 168, 204, 0.3)' });

export default RegistroPaciente;