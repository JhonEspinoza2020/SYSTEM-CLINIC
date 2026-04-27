import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

const DashboardPaciente = () => {
    const navigate = useNavigate();
    const [paciente, setPaciente] = useState({});
    const [citas, setCitas] = useState([]);
    const [doctores, setDoctores] = useState([]);
    const [mostrarModal, setMostrarModal] = useState(false);
    
    const [nuevaCita, setNuevaCita] = useState({ especialidad: '', doctorId: '', nombreDoctor: '', fecha: '', hora: '', motivo: '' });

    // 🚀 Lógica para bloquear fechas en el pasado
    const obtenerFechaMinima = () => {
        const hoy = new Date();
        return hoy.toISOString().split('T')[0]; // Devuelve formato YYYY-MM-DD
    };

    useEffect(() => {
        const usuarioLocal = JSON.parse(localStorage.getItem('usuarioLogueado'));
        if (!usuarioLocal || usuarioLocal.rol !== 'PACIENTE') { navigate('/'); return; }
        setPaciente(usuarioLocal);
        cargarCitas(usuarioLocal.id);
        cargarDoctores();
    }, [navigate]);

    const cargarCitas = async (pacienteId) => {
        try {
            const res = await axios.get(`http://localhost:8080/api/citas/paciente/${pacienteId}`);
            setCitas(res.data);
        } catch (error) { console.error("Error al cargar citas"); }
    };

    const cargarDoctores = async () => {
        try {
            const res = await axios.get('http://localhost:8080/api/auth/doctores-activos');
            setDoctores(res.data);
        } catch (error) { console.error("Error al cargar doctores"); }
    };

    const handleAgendar = async (e) => {
        e.preventDefault();

        // 🚀 VALIDACIONES DE SEGURIDAD FRONTEND
        if (nuevaCita.hora < "08:00" || nuevaCita.hora > "18:00") {
            return Swal.fire('Horario No Disponible', 'El horario de atención clínica es de 08:00 a 18:00 horas.', 'warning');
        }
        if (nuevaCita.motivo.length < 10) {
            return Swal.fire('Detalle Insuficiente', 'Por favor, describa sus síntomas con un poco más de detalle (mínimo 10 caracteres).', 'warning');
        }

        try {
            const payload = { ...nuevaCita, pacienteId: paciente.id, nombrePaciente: paciente.nombreCompleto };
            await axios.post('http://localhost:8080/api/citas', payload);
            
            try {
                const client = new Client({
                    webSocketFactory: () => new SockJS('http://localhost:8080/ws-novasalud'),
                    onConnect: () => {
                        client.publish({ destination: `/topic/notificaciones/${nuevaCita.doctorId}`, body: JSON.stringify({ mensaje: '¡Tienes una nueva solicitud de cita!' }) });
                        setTimeout(() => client.deactivate(), 1000); 
                    }
                });
                client.activate();
            } catch(e) { console.log("WS No disponible"); }

            Swal.fire({title: '¡Cita Solicitada!', text: 'El doctor revisará tu solicitud.', icon: 'success', confirmButtonColor: '#00A8CC'});
            setMostrarModal(false);
            setNuevaCita({ especialidad: '', doctorId: '', nombreDoctor: '', fecha: '', hora: '', motivo: '' }); // Limpia el formulario
            cargarCitas(paciente.id); 
        } catch (error) { Swal.fire('Error', 'No se pudo agendar la cita.', 'error'); }
    };

    const doctoresFiltrados = doctores.filter(doc => doc.especialidad && doc.especialidad.includes(nuevaCita.especialidad));

    return (
        <div style={{ padding: '30px', backgroundColor: '#f0f4f8', minHeight: '100vh', fontFamily: 'system-ui, sans-serif' }}>
            <style>{`
                @keyframes slideIn { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
                .modal-anim { animation: slideIn 0.3s ease-out forwards; }
                .btn-hover:hover { transform: translateY(-2px); box-shadow: 0 6px 15px rgba(0, 168, 204, 0.4) !important; transition: 0.2s; }
            `}</style>
            
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                {/* CABECERA */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#1e293b', padding: '25px 35px', borderRadius: '16px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', marginBottom: '30px', color: 'white' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <div style={{ background: '#00A8CC', padding: '10px', borderRadius: '12px' }}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                        </div>
                        <div>
                            <h2 style={{ margin: 0, fontSize: '22px' }}>Portal Paciente</h2>
                            <p style={{ margin: '4px 0 0 0', color: '#94a3b8', fontSize: '13px' }}>Bienvenido(a), {paciente.nombreCompleto}</p>
                        </div>
                    </div>
                    <button onClick={() => { localStorage.removeItem('usuarioLogueado'); navigate('/'); }} style={{ padding: '10px 20px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', transition: '0.2s' }}>Cerrar Sesión</button>
                </div>

                {/* BOTÓN NUEVA CITA */}
                <button onClick={() => setMostrarModal(true)} className="btn-hover" style={{ padding: '15px 30px', backgroundColor: '#00A8CC', color: 'white', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 4px 10px rgba(0, 168, 204, 0.2)' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line><line x1="12" y1="14" x2="12" y2="18"></line><line x1="10" y1="16" x2="14" y2="16"></line></svg>
                    Agendar Nueva Consulta
                </button>

                {/* TABLA DE CITAS */}
                <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '30px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)' }}>
                    <h3 style={{ marginTop: 0, color: '#1e293b', borderBottom: '1px solid #e2e8f0', paddingBottom: '15px', fontSize: '18px' }}>Mi Historial de Solicitudes</h3>
                    {citas.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '40px 0', color: '#94a3b8' }}>No tienes citas programadas aún. Usa el botón superior para agendar una.</div>
                    ) : (
                        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '15px' }}>
                            <thead>
                                <tr style={{ backgroundColor: '#f8fafc', textAlign: 'left', fontSize: '12px', textTransform: 'uppercase', color: '#64748b', letterSpacing:'0.5px' }}>
                                    <th style={thStyle}>Fecha Programada</th>
                                    <th style={thStyle}>Especialidad</th>
                                    <th style={thStyle}>Médico Asignado</th>
                                    <th style={thStyle}>Estado Actual</th>
                                </tr>
                            </thead>
                            <tbody>
                                {citas.map(cita => (
                                    <tr key={cita.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                        <td style={tdStyle}><strong style={{color:'#1e293b'}}>{cita.fecha}</strong> <br/> <span style={{color: '#64748b', fontSize: '13px'}}>{cita.hora}</span></td>
                                        <td style={tdStyle}><span style={{background:'#e0f2fe', color:'#0369a1', padding:'4px 10px', borderRadius:'12px', fontSize:'12px', fontWeight:'bold'}}>{cita.especialidad}</span></td>
                                        <td style={tdStyle}>Dr. {cita.nombreDoctor}</td>
                                        <td style={tdStyle}>
                                            <span style={badgeStyle(cita.estado)}>{cita.estado}</span>
                                            {cita.estado === 'RECHAZADA' && <div style={{ fontSize: '11px', color: '#ef4444', marginTop: '6px', background:'#fee2e2', padding:'4px 8px', borderRadius:'6px' }}><strong>Motivo:</strong> {cita.motivoRechazo}</div>}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* MODAL PARA AGENDAR CITA */}
                {mostrarModal && (
                    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(15, 23, 42, 0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }}>
                        <div className="modal-anim" style={{ backgroundColor: 'white', padding: '35px', borderRadius: '20px', width: '100%', maxWidth: '500px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }}>
                            <h3 style={{ marginTop: 0, color: '#1e293b', marginBottom: '20px', fontSize: '20px', borderBottom: '2px solid #f1f5f9', paddingBottom: '10px' }}>Reservar Turno Médico</h3>
                            <form onSubmit={handleAgendar}>
                                <label style={labelStyle}>Especialidad Requerida:</label>
                                <select required style={inputStyle} onChange={(e) => setNuevaCita({...nuevaCita, especialidad: e.target.value, doctorId: '', nombreDoctor: ''})}>
                                    <option value="">Seleccione una especialidad...</option>
                                    <option value="Medicina General">Medicina General</option>
                                    <option value="Cardiología">Cardiología</option>
                                    <option value="Pediatría">Pediatría</option>
                                    <option value="Neurología">Neurología</option>
                                    <option value="Traumatología">Traumatología</option>
                                </select>

                                <label style={labelStyle}>Médico Especialista:</label>
                                <select required style={inputStyle} value={nuevaCita.doctorId} disabled={!nuevaCita.especialidad} onChange={(e) => {
                                    const doc = doctores.find(d => d.id === e.target.value);
                                    setNuevaCita({...nuevaCita, doctorId: doc.id, nombreDoctor: doc.nombreCompleto});
                                }}>
                                    <option value="">Seleccione un doctor...</option>
                                    {doctoresFiltrados.map(doc => <option key={doc.id} value={doc.id}>Dr. {doc.nombreCompleto}</option>)}
                                </select>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                    <div>
                                        <label style={labelStyle}>Día:</label>
                                        <input 
                                            type="date" 
                                            required 
                                            min={obtenerFechaMinima()} 
                                            style={inputStyle} 
                                            onChange={(e) => setNuevaCita({...nuevaCita, fecha: e.target.value})} 
                                        />
                                    </div>
                                    <div>
                                        <label style={labelStyle}>Hora Estimada:</label>
                                        <input 
                                            type="time" 
                                            required 
                                            min="08:00" 
                                            max="18:00" 
                                            style={inputStyle} 
                                            onChange={(e) => setNuevaCita({...nuevaCita, hora: e.target.value})} 
                                            title="Atención de 08:00 a 18:00" 
                                        />
                                    </div>
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                    <label style={{...labelStyle, marginBottom: 0}}>Motivo Breve de la Consulta:</label>
                                    <span style={{ fontSize: '11px', fontWeight: 'bold', color: nuevaCita.motivo.length >= 200 ? '#ef4444' : '#94a3b8' }}>
                                        {nuevaCita.motivo.length}/200
                                    </span>
                                </div>
                                <textarea 
                                    required 
                                    rows="2" 
                                    maxLength="200" 
                                    style={inputStyle} 
                                    placeholder="Describa sus síntomas o razón de visita..." 
                                    value={nuevaCita.motivo}
                                    onChange={(e) => setNuevaCita({...nuevaCita, motivo: e.target.value})}>
                                </textarea>

                                <div style={{ display: 'flex', gap: '12px', marginTop: '15px' }}>
                                    <button type="submit" style={{ flex: 1, padding: '14px', backgroundColor: '#00A8CC', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', transition:'0.2s' }}>Confirmar Reserva</button>
                                    <button type="button" onClick={() => { setMostrarModal(false); setNuevaCita({ especialidad: '', doctorId: '', nombreDoctor: '', fecha: '', hora: '', motivo: '' }); }} style={{ flex: 1, padding: '14px', backgroundColor: '#f1f5f9', color: '#475569', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', transition:'0.2s' }}>Cancelar</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const thStyle = { padding: '15px', borderBottom: '2px solid #f1f5f9' };
const tdStyle = { padding: '15px', color: '#334155', fontSize: '14px' };
const labelStyle = { display: 'block', marginBottom: '8px', fontWeight: '700', color: '#64748b', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' };
const inputStyle = { width: '100%', padding: '12px', marginBottom: '20px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box', fontSize: '14px', outlineColor: '#00A8CC' };

const badgeStyle = (estado) => {
    let bg = '#f1f5f9', color = '#475569';
    if (estado === 'PENDIENTE') { bg = '#fef3c7'; color = '#a16207'; }
    if (estado === 'CONFIRMADA') { bg = '#dcfce7'; color = '#15803d'; }
    if (estado === 'RECHAZADA') { bg = '#fee2e2'; color = '#b91c1c'; }
    return { backgroundColor: bg, color: color, padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '800', display: 'inline-block', letterSpacing:'0.5px' };
};

export default DashboardPaciente;