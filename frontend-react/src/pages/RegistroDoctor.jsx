import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

const RegistroDoctor = () => {
    const navigate = useNavigate();
    const [doctor, setDoctor] = useState({ nombreCompleto: '', dniDoctor: '', correo: '', password: '', firmaDigital: '' });
    const [especialidadesSeleccionadas, setEspecialidadesSeleccionadas] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const listaEspecialidades = ['Medicina General', 'Cardiología', 'Pediatría', 'Neurología', 'Traumatología'];

    const handleChange = (e) => { setDoctor({ ...doctor, [e.target.name]: e.target.value }); };

    const handleCheckboxChange = (esp) => {
        if (especialidadesSeleccionadas.includes(esp)) {
            setEspecialidadesSeleccionadas(especialidadesSeleccionadas.filter(e => e !== esp));
        } else {
            setEspecialidadesSeleccionadas([...especialidadesSeleccionadas, esp]);
        }
    };

    const handleFirmaUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) return Swal.fire('Archivo muy grande', 'La firma debe pesar menos de 2MB', 'warning');
            const reader = new FileReader();
            reader.onloadend = () => { setDoctor({ ...doctor, firmaDigital: reader.result }); };
            reader.readAsDataURL(file);
        }
    };

    const registrar = async (e) => {
        e.preventDefault();
        
        if (especialidadesSeleccionadas.length === 0) return Swal.fire('Falta Especialidad', 'Seleccione al menos una especialidad médica.', 'warning');
        if (doctor.dniDoctor.length !== 8) return Swal.fire('Error', 'DNI debe tener 8 dígitos.', 'warning');

        setIsLoading(true);
        try {
            const payload = { 
                ...doctor, 
                especialidad: especialidadesSeleccionadas.join(', '),
                rol: 'DOCTOR',
                estado: 'PENDIENTE' 
            };

            await axios.post('http://localhost:8080/api/auth/registro', payload);
            
            Swal.fire({
                title: 'Solicitud Enviada',
                text: 'Su registro como Médico ha sido enviado. Un administrador verificará sus datos antes de activar su cuenta.',
                icon: 'success',
                confirmButtonColor: '#2ecc71'
            }).then(() => navigate('/'));
        } catch (err) {
            Swal.fire('Error', err.response?.data || 'Error en el servidor.', 'error');
            setIsLoading(false);
        }
    };

    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: '#0f172a', padding: '40px 0', fontFamily: 'system-ui, sans-serif' }}>
            <style>{`
                @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
                .animar-box { animation: slideUp 0.6s ease-out forwards; }
                input::placeholder { color: rgba(255,255,255,0.4); }
                .checkbox-custom { accent-color: #2ecc71; width: 16px; height: 16px; cursor: pointer; }
            `}</style>
            
            <div className="animar-box" style={{ width: '100%', maxWidth: '650px', background: 'rgba(255,255,255,0.03)', padding: '45px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)', backdropFilter: 'blur(10px)' }}>
                
                <div style={{ textAlign: 'center', marginBottom: '35px' }}>
                    <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#2ecc71" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '10px' }}>
                        <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                    </svg>
                    <h2 style={{ color: 'white', margin: 0, fontSize: '28px', fontWeight: '800', letterSpacing: '0.5px' }}>Perfil <span style={{color: '#2ecc71'}}>Médico</span></h2>
                    <p style={{ color: '#94a3b8', fontSize: '13px', marginTop: '8px' }}>Complete sus datos para unirse a la red NovaSalud</p>
                </div>
                
                <form onSubmit={registrar}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                        <div>
                            <label style={labelStyle}>Nombre Completo</label>
                            <input type="text" name="nombreCompleto" placeholder="Ej. Dr. Carlos Mendoza" onChange={handleChange} required style={inputStyle} disabled={isLoading} />
                        </div>
                        <div>
                            <label style={labelStyle}>Documento de Identidad</label>
                            <input type="text" name="dniDoctor" placeholder="DNI / CMP" maxLength="8" onChange={handleChange} required style={inputStyle} disabled={isLoading} />
                        </div>
                    </div>
                    
                    <label style={labelStyle}>Correo Institucional</label>
                    <input type="email" name="correo" placeholder="doctor@novasalud.com" onChange={handleChange} required style={inputStyle} disabled={isLoading} />
                    
                    <label style={labelStyle}>Contraseña de Acceso</label>
                    <input type="password" name="password" placeholder="Mínimo 8 caracteres" onChange={handleChange} required style={inputStyle} disabled={isLoading} />
                    
                    {/* ÁREA CLÍNICA */}
                    <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '20px', borderRadius: '12px', marginBottom: '20px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <label style={{ color: '#2ecc71', fontWeight: '700', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '15px' }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="12" y1="18" x2="12" y2="12"></line><line x1="9" y1="15" x2="15" y2="15"></line></svg>
                            Áreas de Especialidad
                        </label>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                            {listaEspecialidades.map(esp => (
                                <label key={esp} style={{ color: '#cbd5e1', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', transition: '0.2s' }} className="hover-esp">
                                    <input type="checkbox" className="checkbox-custom" onChange={() => handleCheckboxChange(esp)} checked={especialidadesSeleccionadas.includes(esp)} disabled={isLoading} />
                                    {esp}
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* SUBIR FIRMA */}
                    <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '20px', borderRadius: '12px', marginBottom: '25px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <label style={{ color: '#94a3b8', fontWeight: '700', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                            Firma Digital (Opcional)
                        </label>
                        <p style={{ color: '#64748b', fontSize: '12px', marginTop: 0, marginBottom: '15px' }}>Formatos soportados: PNG (sin fondo) o JPEG. Máx. 2MB.</p>
                        
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <label style={{ background: '#1e293b', color: 'white', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '600', border: '1px solid #334155', transition: '0.3s' }}>
                                Seleccionar Archivo
                                <input type="file" accept="image/png, image/jpeg" onChange={handleFirmaUpload} style={{ display: 'none' }} disabled={isLoading} />
                            </label>
                            {doctor.firmaDigital && <span style={{ color: '#2ecc71', fontSize: '13px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '5px' }}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg> Documento cargado</span>}
                        </div>
                    </div>
                    
                    <button type="submit" disabled={isLoading} style={btnSubmitStyle(isLoading)}>
                        {isLoading ? 'PROCESANDO SOLICITUD...' : 'ENVIAR SOLICITUD DE INGRESO'}
                    </button>
                </form>
                
                <div style={{ textAlign: 'center', marginTop: '25px' }}>
                    <Link to="/registro" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '13px', fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '5px', transition: '0.3s' }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                        Volver a Opciones
                    </Link>
                </div>
            </div>
        </div>
    );
};

const labelStyle = { color: '#94a3b8', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '8px' };
const inputStyle = { width: '100%', padding: '15px', marginBottom: '20px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(15, 23, 42, 0.6)', color: 'white', boxSizing: 'border-box', fontSize: '14px', outline: 'none', transition: '0.3s' };
const btnSubmitStyle = (disabled) => ({ width: '100%', padding: '16px', background: disabled ? 'rgba(46, 204, 113, 0.5)' : '#2ecc71', color: 'white', border: 'none', borderRadius: '10px', fontWeight: '800', cursor: disabled ? 'not-allowed' : 'pointer', fontSize: '14px', letterSpacing: '1px', transition: '0.3s', boxShadow: disabled ? 'none' : '0 10px 15px -3px rgba(46, 204, 113, 0.3)' });

export default RegistroDoctor;