import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import PacienteService from '../services/PacienteService';
import Swal from 'sweetalert2';

const DashboardAdmin = () => {
    const navigate = useNavigate();
    const [tab, setTab] = useState('doctores'); 
    const [usuarios, setUsuarios] = useState([]);
    const [pacientes, setPacientes] = useState([]);
    const [seleccionado, setSeleccionado] = useState(null); 
    
    const adminLogueado = JSON.parse(localStorage.getItem('usuarioLogueado') || '{}');

    useEffect(() => {
        if (adminLogueado.rol !== 'ADMIN') { navigate('/'); return; }
        cargarDatos();
    }, [navigate, adminLogueado.rol]);

    const cargarDatos = async () => {
        try {
            const resU = await axios.get('http://localhost:8080/api/auth/usuarios');
            setUsuarios(resU.data.filter(u => u.rol !== 'ADMIN'));
            const resP = await PacienteService.obtenerTodosLosPacientes();
            setPacientes(resP.data);
        } catch (error) { console.error("Error al cargar datos globales", error); }
    };

    const cambiarEstado = async (id, nuevoEstado, nombre) => {
        try {
            await axios.put(`http://localhost:8080/api/auth/usuarios/${id}/estado`, { estado: nuevoEstado });
            Swal.fire({ title: '¡Éxito!', text: `${nombre} ahora está ${nuevoEstado}`, icon: 'success', confirmButtonColor: '#00A8CC' });
            cargarDatos();
        } catch (error) { Swal.fire('Error', 'No se pudo actualizar el estado.', 'error'); }
    };

    const eliminarUsuario = (id, nombre) => {
        Swal.fire({
            title: '¿Confirmar eliminación?',
            text: `Se borrará permanentemente a: ${nombre}`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#e74c3c',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.delete(`http://localhost:8080/api/auth/usuarios/${id}`);
                    Swal.fire('Eliminado', 'Usuario borrado de la red NovaSalud.', 'success');
                    cargarDatos();
                } catch (e) { Swal.fire('Error', 'No se pudo eliminar.', 'error'); }
            }
        });
    };

    const verDetallePaciente = (p) => {
        const [hc, detalles] = (p.historiaClinica || "").split(' | ');
        Swal.fire({
            title: `📋 Expediente: ${p.nombre} ${p.apellidoPaterno}`,
            html: `<div style="text-align: left; font-size: 14px; background: #f8fafc; padding: 15px; border-radius: 8px;">
                    <p><b>DNI:</b> ${p.dni}</p> <p><b>HC:</b> ${hc || 'N/A'}</p>
                    <p><b>Edad:</b> ${p.edad} años | <b>Sexo:</b> ${p.sexo}</p><hr/>
                    <p style="color: #00A8CC; font-weight: bold;">🩺 Detalles Clínicos:</p>
                    <p><i>${detalles || 'Sin detalles registrados.'}</i></p>
                   </div>`,
            confirmButtonColor: '#1e293b'
        });
    };

    const verFirmaDoctor = (u) => {
        if (!u.firmaDigital) return Swal.fire('Sin Firma', 'Este médico no ha subido su firma.', 'warning');
        Swal.fire({
            title: `Firma: Dr(a). ${u.nombreCompleto}`,
            imageUrl: u.firmaDigital,
            imageAlt: 'Firma Digital',
            imageHeight: 180,
            confirmButtonColor: '#1e293b'
        });
    };

    return (
        <div style={{ backgroundColor: '#f1f5f9', minHeight: '100vh', fontFamily: 'Segoe UI, sans-serif' }}>
            
            <style>{`
                @keyframes slideIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
                .animar-panel { animation: slideIn 0.5s ease-out forwards; }
                .tr-hover:hover { background-color: #f8fafc !important; transition: 0.2s; }
            `}</style>

            <div style={{ backgroundColor: '#1e293b', color: 'white', padding: '15px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
                <div>
                    <h2 style={{ margin: 0, fontSize: '20px' }}>🛡️ NovaSalud | Panel Administrativo</h2>
                    <span style={{ fontSize: '11px', color: '#94a3b8' }}>Usuario: {adminLogueado.nombreCompleto} (Director)</span>
                </div>
                <button onClick={() => { localStorage.removeItem('usuarioLogueado'); navigate('/'); }} style={{ background: '#e74c3c', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>Cerrar Sesión</button>
            </div>

            <div style={{ maxWidth: '1300px', margin: '30px auto', padding: '0 20px' }} className="animar-panel">
                
                <div style={{ display: 'flex', gap: '15px', marginBottom: '25px' }}>
                    <button onClick={() => setTab('doctores')} style={tabBtnStyle(tab === 'doctores')}>👨‍⚕️ Personal Médico</button>
                    <button onClick={() => setTab('pacientes')} style={tabBtnStyle(tab === 'pacientes')}>📑 Historial Global</button>
                </div>

                <div style={{ backgroundColor: 'white', borderRadius: '15px', padding: '30px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', borderTop: '5px solid #1e293b' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#f8fafc', textAlign: 'left', color: '#64748b', fontSize: '12px', textTransform: 'uppercase' }}>
                                <th style={thStyle}>{tab === 'doctores' ? 'Médico' : 'Paciente'}</th>
                                <th style={thStyle}>{tab === 'doctores' ? 'Identidad / Correo' : 'DNI'}</th>
                                <th style={thStyle}>{tab === 'doctores' ? 'Especialidad' : 'Riesgo IA'}</th>
                                <th style={thStyle}>Estado</th>
                                <th style={{...thStyle, textAlign: 'center'}}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tab === 'doctores' ? usuarios.map(u => (
                                <tr key={u.id} className="tr-hover" style={{ borderBottom: '1px solid #f1f5f9' }}>
                                    <td style={tdStyle}><b>{u.nombreCompleto}</b><br/><small style={{color:'#00A8CC', fontWeight:'bold'}}>{u.rol}</small></td>
                                    <td style={tdStyle}>{u.dniDoctor || 'S/D'}<br/><small>{u.correo}</small></td>
                                    <td style={tdStyle}><span style={badgeEsp}>{u.especialidad || 'General'}</span></td>
                                    <td style={tdStyle}><span style={badgeStyle(u.estado)}>{u.estado}</span></td>
                                    <td style={{...tdStyle, textAlign: 'center'}}>
                                        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                                            <button onClick={() => verFirmaDoctor(u)} style={btnIcon} title="Ver Firma">🖋️</button>
                                            <button onClick={() => cambiarEstado(u.id, u.estado === 'ACTIVO' ? 'INACTIVO' : 'ACTIVO', u.nombreCompleto)} style={u.estado === 'ACTIVO' ? btnOrange : btnGreen}>{u.estado === 'ACTIVO' ? 'Bloquear' : 'Activar'}</button>
                                            <button onClick={() => eliminarUsuario(u.id, u.nombreCompleto)} style={btnRed}>🗑️</button>
                                        </div>
                                    </td>
                                </tr>
                            )) : pacientes.map(p => (
                                <tr key={p.id} className="tr-hover" style={{ borderBottom: '1px solid #f1f5f9' }}>
                                    <td style={tdStyle}><b>{p.nombre} {p.apellidoPaterno}</b><br/><small style={{color:'#94a3b8'}}>{p.historiaClinica?.split(' | ')[0]}</small></td>
                                    <td style={tdStyle}>{p.dni}</td>
                                    <td style={tdStyle}><b style={{ color: p.riesgoPredicho === 'ALTO' ? '#ef4444' : '#22c55e' }}>{p.riesgoPredicho || 'NORMAL'}</b></td>
                                    <td style={tdStyle}><span style={badgeStyle('ACTIVO')}>ACTIVO</span></td>
                                    <td style={{...tdStyle, textAlign: 'center'}}>
                                        <button onClick={() => verDetallePaciente(p)} style={btnCyan}>🔍 Ver Historia</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const tabBtnStyle = (act) => ({ padding: '12px 24px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px', backgroundColor: act ? '#1e293b' : '#cbd5e1', color: act ? 'white' : '#475569', transition: '0.3s' });
const thStyle = { padding: '15px', borderBottom: '2px solid #f1f5f9' };
const tdStyle = { padding: '15px', fontSize: '14px', color: '#1e293b' };
const badgeEsp = { background: '#e0f2fe', color: '#0369a1', padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold' };
const btnIcon = { background: '#f1f5f9', border: 'none', padding: '8px', borderRadius: '6px', cursor: 'pointer' };
const btnGreen = { background: '#22c55e', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' };
const btnOrange = { background: '#f59e0b', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' };
const btnRed = { background: '#fee2e2', color: '#dc2626', border: 'none', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer' };
const btnCyan = { background: '#00A8CC', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' };

const badgeStyle = (estado) => {
    let bg = '#e2e8f0', col = '#475569';
    if (estado === 'ACTIVO') { bg = '#dcfce7'; col = '#166534'; }
    if (estado === 'PENDIENTE') { bg = '#fef9c3'; col = '#854d0e'; }
    if (estado === 'INACTIVO') { bg = '#fee2e2'; col = '#991b1b'; }
    return { backgroundColor: bg, color: col, padding: '4px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: 'bold' };
};

export default DashboardAdmin;