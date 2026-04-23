import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2'; 

const RegistroDoctor = () => {
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
    const [isLoading, setIsLoading] = useState(false); 
    const navigate = useNavigate();

    const validarCorreo = (correo) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const parteLocal = correo.split('@')[0]; // Saca lo que está antes del @

        if (correo.length > 50) {
            setCorreoError('El correo es demasiado largo (máximo 50 caracteres)');
        } else if (correo && !regex.test(correo)) {
            setCorreoError('Formato de correo inválido');
        } else if (parteLocal && /^\d+$/.test(parteLocal)) {
            // Verifica si lo que está antes del @ son solo números
            setCorreoError('El correo no puede tener solo números');
        } else {
            setCorreoError('');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        const caracteresProhibidos = /[<>"';]/g;
        if (caracteresProhibidos.test(value)) {
            setMensaje({ texto: 'Caracteres especiales no permitidos', tipo: 'error' });
            return; 
        }

        if (name === 'nombreCompleto') {
            const soloLetras = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]*$/;
            if (!soloLetras.test(value)) return;
        }

        if (name === 'dniDoctor' && !/^\d*$/.test(value)) return;

        setDoctor({ ...doctor, [name]: value });
        if (name === 'correo') validarCorreo(value);
    };

    const registrarse = async (e) => {
        e.preventDefault();
        setMensaje({ texto: '', tipo: '' });
        
        if (correoError || doctor.dniDoctor.length !== 8) return;

        const nombre = doctor.nombreCompleto.trim();
        if (!/[aeiouáéíóúAEIOUÁÉÍÓÚ]/.test(nombre)) {
            Swal.fire('Nombre Inválido', 'El nombre debe contener vocales', 'warning');
            setMensaje({ texto: 'El nombre debe contener vocales', tipo: 'error' });
            return;
        }

        setIsLoading(true); 

        try {
            const payload = { ...doctor, nombreCompleto: nombre };
            const respuesta = await axios.post('http://localhost:8080/api/auth/registro', payload);
            
            if (respuesta.status === 201) {
                setMensaje({ texto: '¡Registro NovaSalud Exitoso! Redirigiendo...', tipo: 'exito' });
                Swal.fire({
                    title: '¡Registro Exitoso!',
                    text: 'Bienvenido a la red NovaSalud. Redirigiendo...',
                    icon: 'success',
                    timer: 2000,
                    showConfirmButton: false
                }).then(() => {
                    navigate('/');
                });
            }
        } catch (err) {
            Swal.fire('Error en Registro', 'El correo o DNI ya se encuentran registrados', 'error');
            setMensaje({ texto: 'El correo o DNI ya se encuentran registrados', tipo: 'error' });
            setIsLoading(false); 
        }
    };

    return (
        <div className="container-registro">
            <style>{`
                .container-registro {
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: linear-gradient(135deg, #1a365d 0%, #2d3748 100%);
                    font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
                }

                .card-registro-nova {
                    background: #ffffff;
                    padding: 40px;
                    border-radius: 20px;
                    width: 100%;
                    max-width: 480px;
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
                    animation: novaReveal 0.7s cubic-bezier(0.19, 1, 0.22, 1) forwards;
                    opacity: 0;
                }

                @keyframes novaReveal {
                    from { opacity: 0; transform: translateY(30px) scale(0.95); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                }

                .nova-input {
                    width: 100%;
                    padding: 12px 16px;
                    margin-top: 6px;
                    margin-bottom: 16px;
                    border: 1px solid #e2e8f0;
                    border-radius: 10px;
                    font-size: 15px;
                    transition: all 0.3s ease;
                    outline: none;
                    box-sizing: border-box;
                }

                .nova-input:focus {
                    border-color: #00a8cc;
                    box-shadow: 0 0 0 4px rgba(0, 168, 204, 0.15);
                }

                .btn-nova-submit {
                    width: 100%;
                    padding: 14px;
                    background: #1a365d;
                    color: white;
                    border: none;
                    border-radius: 10px;
                    font-weight: 700;
                    font-size: 16px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    margin-top: 10px;
                }

                .btn-nova-submit:hover:not(:disabled) {
                    background: #2c5282;
                    transform: translateY(-2px);
                    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.2);
                }

                .btn-nova-submit:disabled {
                    background: #cbd5e0;
                    cursor: not-allowed;
                    transform: none;
                }
            `}</style>

            <div className="card-registro-nova">
                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                    <svg width="60" height="60" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ margin: '0 auto' }}>
                        <rect width="100" height="100" rx="22" fill="#1A365D"/>
                        <path d="M28 72 V28 L72 72 V28" stroke="#00A8CC" strokeWidth="10" strokeLinecap="square" strokeLinejoin="miter"/>
                    </svg>
                    
                    <h2 style={{ color: '#1a365d', margin: '15px 0 5px 0', fontSize: '28px', fontWeight: '800' }}>NovaSalud</h2>
                    <p style={{ color: '#718096', fontSize: '13px', fontWeight: '600', letterSpacing: '1px' }}>REGISTRO DE PERSONAL MÉDICO</p>
                </div>

                {mensaje.texto && (
                    <div style={{ 
                        backgroundColor: mensaje.tipo === 'error' ? '#fff5f5' : '#f0fff4', 
                        color: mensaje.tipo === 'error' ? '#c53030' : '#2f855a', 
                        padding: '12px', marginBottom: '20px', borderRadius: '10px', 
                        textAlign: 'center', fontWeight: 'bold', fontSize: '14px',
                        border: `1px solid ${mensaje.tipo === 'error' ? '#feb2b2' : '#9ae6b4'}`
                    }}>
                        {mensaje.texto}
                    </div>
                )}

                <form onSubmit={registrarse}>
                    <label style={labelStyle}>NOMBRE Y APELLIDO</label>
                    <input type="text" name="nombreCompleto" value={doctor.nombreCompleto} onChange={handleChange} required className="nova-input" placeholder="Ej: Dr. Julián Castro" disabled={isLoading} />

                    <div style={{ display: 'flex', gap: '15px' }}>
                        <div style={{ flex: 1 }}>
                            <label style={labelStyle}>DNI (8 DÍGITOS)</label>
                            <input type="text" name="dniDoctor" value={doctor.dniDoctor} onChange={handleChange} maxLength="8" required className="nova-input" style={{ borderColor: doctor.dniDoctor.length > 0 && doctor.dniDoctor.length !== 8 ? '#e53e3e' : '#e2e8f0' }} disabled={isLoading} />
                        </div>
                        <div style={{ flex: 1.5 }}>
                            <label style={labelStyle}>CORREO</label>
                            <input type="email" name="correo" value={doctor.correo} onChange={handleChange} required maxLength="50" className="nova-input" style={{ borderColor: correoError ? '#e53e3e' : '#e2e8f0', marginBottom: correoError ? '5px' : '16px' }} disabled={isLoading} />
                            {correoError && <span style={{ color: '#e53e3e', fontSize: '11px', display: 'block', marginBottom: '16px', fontWeight: 'bold' }}>{correoError}</span>}
                        </div>
                    </div>
                    
                    <label style={labelStyle}>CONTRASEÑA DE ACCESO</label>
                    <div style={{ position: 'relative' }}>
                        <input type={mostrarPassword ? "text" : "password"} name="password" value={doctor.password} onChange={handleChange} required className="nova-input" disabled={isLoading} />
                        <button type="button" onClick={() => setMostrarPassword(!mostrarPassword)} disabled={isLoading} style={{ position: 'absolute', right: '12px', top: '16px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px' }}>
                            {mostrarPassword ? "🙈" : "👁️"}
                        </button>
                    </div>

                    <label style={labelStyle}>ESPECIALIDAD MÉDICA</label>
                    <select name="especialidad" value={doctor.especialidad} onChange={handleChange} required className="nova-input" style={{ backgroundColor: '#f8fafc' }} disabled={isLoading}>
                        <option value="">Seleccione especialidad...</option>
                        <option value="Medicina General">Medicina General</option>
                        <option value="Cardiología">Cardiología</option>
                        <option value="Pediatría">Pediatría</option>
                        <option value="Neurología">Neurología</option>
                        <option value="Traumatología">Traumatología</option>
                    </select>

                    <button type="submit" disabled={!!correoError || doctor.dniDoctor.length !== 8 || isLoading} className="btn-nova-submit">
                        {isLoading ? '⏳ CREANDO CREDENCIALES...' : 'CONFIRMAR REGISTRO'}
                    </button>
                </form>

                <div style={{ textAlign: 'center', marginTop: '25px' }}>
                    <Link to="/" style={{ color: '#2c5282', textDecoration: 'none', fontWeight: '700', fontSize: '14px' }}>
                        ← Regresar al Inicio de Sesión
                    </Link>
                </div>
            </div>
        </div>
    );
};

const labelStyle = { fontWeight: '800', color: '#4a5568', fontSize: '11px', display: 'block', letterSpacing: '0.5px', marginLeft: '4px' };

export default RegistroDoctor;