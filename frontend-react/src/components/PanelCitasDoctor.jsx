import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

const PanelCitasDoctor = () => {
    const [citas, setCitas] = useState([]);
    const doctorLogueado = JSON.parse(localStorage.getItem('usuarioLogueado') || '{}');

    const cargarCitas = useCallback(async () => {
        if (!doctorLogueado.id) return;
        try {
            const res = await axios.get(`http://localhost:8080/api/citas/doctor/${doctorLogueado.id}`);
            setCitas(res.data.reverse());
        } catch (error) {
            console.error("Error al cargar las citas del doctor", error);
        }
    }, [doctorLogueado.id]);

    useEffect(() => {
        cargarCitas();
        if (!doctorLogueado.id) return;
        
        const client = new Client({
            webSocketFactory: () => new SockJS('http://localhost:8080/ws-novasalud'),
            reconnectDelay: 5000,
            onConnect: () => {
                client.subscribe(`/topic/notificaciones/${doctorLogueado.id}`, (mensaje) => {
                    Swal.fire({
                        toast: true, position: 'top-end', icon: 'info',
                        title: '🔔 ¡Nueva Cita Recibida!',
                        text: 'Un paciente acaba de solicitar un turno.',
                        showConfirmButton: false, timer: 4000, timerProgressBar: true
                    });
                    cargarCitas();
                });
            }
        });
        client.activate();
        return () => { client.deactivate(); };
    }, [cargarCitas, doctorLogueado.id]);

    const cambiarEstado = async (citaId, nuevoEstado) => {
        let motivoRechazo = "";
        if (nuevoEstado === 'RECHAZADA') {
            const { value: motivo } = await Swal.fire({
                title: 'Motivo de Rechazo', input: 'textarea',
                inputLabel: 'Explique al paciente por qué no puede atenderlo:',
                inputPlaceholder: 'Ej: Lo siento, tengo cirugía a esa hora...',
                showCancelButton: true, confirmButtonText: 'Enviar Rechazo', cancelButtonText: 'Cancelar',
                inputValidator: (value) => { if (!value) return '¡Debe ingresar un motivo!'; }
            });
            if (!motivo) return; 
            motivoRechazo = motivo;
        }

        try {
            await axios.put(`http://localhost:8080/api/citas/${citaId}/estado`, { estado: nuevoEstado, motivoRechazo: motivoRechazo });
            Swal.fire({title: '¡Actualizado!', text: `Cita ${nuevoEstado.toLowerCase()}.`, icon: 'success', confirmButtonColor: '#00A8CC'});
            cargarCitas(); 
        } catch (error) { Swal.fire('Error', 'No se pudo actualizar la cita.', 'error'); }
    };

    const citasPendientes = citas.filter(c => c.estado === 'PENDIENTE');

    return (
        <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '25px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)', marginBottom: '25px', borderTop: '5px solid #00A8CC', fontFamily: 'system-ui, sans-serif' }}>
            <h3 style={{ marginTop: 0, color: '#1e293b', borderBottom: '1px solid #e2e8f0', paddingBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '18px' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00A8CC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
                Gestión de Citas Activas
                {citasPendientes.length > 0 && (
                    <span style={{ backgroundColor: '#ef4444', color: 'white', borderRadius: '20px', padding: '2px 10px', fontSize: '12px', fontWeight: 'bold', marginLeft: 'auto' }}>
                        {citasPendientes.length} Pendientes
                    </span>
                )}
            </h3>

            {citas.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 0', color: '#94a3b8' }}>
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" style={{opacity: 0.5, marginBottom:'10px'}}><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                    <p style={{margin:0}}>No tienes citas programadas en tu agenda.</p>
                </div>
            ) : (
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#f8fafc', color: '#64748b', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                <th style={thStyle}>Paciente</th>
                                <th style={thStyle}>Fecha / Hora</th>
                                <th style={thStyle}>Motivo de Consulta</th>
                                <th style={thStyle}>Estado</th>
                                <th style={{...thStyle, textAlign: 'center'}}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {citas.map(cita => (
                                <tr key={cita.id} style={{ borderBottom: '1px solid #f1f5f9', backgroundColor: cita.estado === 'PENDIENTE' ? '#f0fdf4' : 'transparent', transition: 'background-color 0.3s' }}>
                                    <td style={tdStyle}><strong style={{color: '#1e293b'}}>{cita.nombrePaciente}</strong></td>
                                    <td style={tdStyle}>
                                        <div style={{display:'flex', alignItems:'center', gap:'5px'}}>
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                                            <span style={{fontWeight:'500'}}>{cita.fecha}</span>
                                        </div>
                                        <span style={{color: '#64748b', fontSize: '12px', marginLeft:'19px'}}>{cita.hora}</span>
                                    </td>
                                    <td style={tdStyle}><i style={{color: '#475569'}}>{cita.motivo}</i></td>
                                    <td style={tdStyle}><span style={badgeStyle(cita.estado)}>{cita.estado}</span></td>
                                    <td style={{...tdStyle, textAlign: 'center'}}>
                                        {cita.estado === 'PENDIENTE' ? (
                                            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                                                <button onClick={() => cambiarEstado(cita.id, 'CONFIRMADA')} style={btnAceptar} title="Aceptar Cita">Aprobar</button>
                                                <button onClick={() => cambiarEstado(cita.id, 'RECHAZADA')} style={btnRechazar} title="Rechazar Cita">Rechazar</button>
                                            </div>
                                        ) : (
                                            <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight:'bold' }}>GESTIONADA</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

const thStyle = { padding: '15px', borderBottom: '2px solid #f1f5f9', textAlign: 'left' };
const tdStyle = { padding: '15px', color: '#334155', fontSize: '14px' };
const btnAceptar = { background: '#10b981', color: 'white', border: 'none', borderRadius: '6px', padding: '6px 12px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px', transition: '0.2s' };
const btnRechazar = { background: '#ef4444', color: 'white', border: 'none', borderRadius: '6px', padding: '6px 12px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px', transition: '0.2s' };

const badgeStyle = (estado) => {
    let bg = '#f1f5f9', color = '#475569';
    if (estado === 'PENDIENTE') { bg = '#fef3c7'; color = '#a16207'; }
    if (estado === 'CONFIRMADA') { bg = '#dcfce7'; color = '#15803d'; }
    if (estado === 'RECHAZADA') { bg = '#fee2e2'; color = '#b91c1c'; }
    return { backgroundColor: bg, color: color, padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '800', display: 'inline-block', letterSpacing:'0.5px' };
};

export default PanelCitasDoctor;