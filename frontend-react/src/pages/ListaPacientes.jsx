import React, { useEffect, useState } from 'react';
import PacienteService from '../services/PacienteService';
import PacienteRiesgoResumen from '../components/pacientes/PacienteRiesgoResumen';
import PacienteEditModal from '../components/pacientes/PacienteEditModal';
import { Icon } from '../components/icons/Icons';
import { theme } from '../styles/dashboardTheme';
import { calcularDatosGrafico, generarPDFMaestro, generarPDFIndividual, obtenerDoctorSesion } from '../utils/pacientePdf';
import Swal from 'sweetalert2';

const ListaPacientes = () => {
    const [pacientes, setPacientes] = useState([]);
    const [pacienteSeleccionado, setPacienteSeleccionado] = useState(null);
    const [pacienteAEditar, setPacienteAEditar] = useState(null);
    const [busqueda, setBusqueda] = useState('');
    const [isSavingEdit, setIsSavingEdit] = useState(false); 

    useEffect(() => { cargarPacientes(); }, []);

    const cargarPacientes = () => {
        const doctorGuardado = localStorage.getItem('usuarioLogueado') || localStorage.getItem('doctorLogueado');
        if (doctorGuardado) {
            const doctor = JSON.parse(doctorGuardado);
            PacienteService.obtenerPacientesPorDoctor(doctor.id)
                .then(respuesta => setPacientes(respuesta.data))
                .catch(error => console.error("Error al obtener datos:", error));
        }
    };

    const eliminarPaciente = (id, nombre) => {
        Swal.fire({
            title: '¿Autorizar Eliminación?',
            text: `Se borrará permanentemente el expediente de: ${nombre}`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#E53E3E',
            cancelButtonColor: '#718096',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                PacienteService.eliminarPaciente(id).then(() => {
                    Swal.fire('Eliminado', 'Expediente borrado del sistema.', 'success');
                    if (pacienteSeleccionado?.id === id) setPacienteSeleccionado(null);
                    cargarPacientes();
                }).catch(() => Swal.fire('Error', 'No se pudo eliminar.', 'error'));
            }
        });
    };

    const iniciarEdicion = (paciente) => { setPacienteAEditar({ ...paciente }); };

    const manejarCambioEdicion = (e) => {
        const { name, value } = e.target;
        setPacienteAEditar({ ...pacienteAEditar, [name]: value });
    };

    const guardarEdicion = (e) => {
        e.preventDefault();
        setIsSavingEdit(true); 

        PacienteService.actualizarPaciente(pacienteAEditar.id, pacienteAEditar)
            .then(() => {
                Swal.fire('¡Expediente Actualizado!', 'El motor de IA ha recalculado el riesgo predictivo.', 'success');
                setPacienteAEditar(null); 
                setPacienteSeleccionado(null); 
                cargarPacientes(); 
            })
            .catch(() => {
                Swal.fire('Error', 'No se pudieron guardar los cambios en el servidor.', 'error');
            })
            .finally(() => setIsSavingEdit(false)); 
    };

    const pacientesFiltrados = pacientes.filter(p => 
        p.nombre.toLowerCase().includes(busqueda.toLowerCase()) || 
        p.apellidoPaterno.toLowerCase().includes(busqueda.toLowerCase()) || 
        p.dni.includes(busqueda)
    );

    const datosGrafico = calcularDatosGrafico(pacientes);

    const exportarPDFMaestro = () => {
        if (pacientesFiltrados.length === 0) return Swal.fire('Sin datos', 'No hay registros para exportar.', 'info');
        generarPDFMaestro(pacientesFiltrados, obtenerDoctorSesion());
    };

    const exportarPDFIndividual = (paciente) => generarPDFIndividual(paciente, obtenerDoctorSesion());

    return (
        <div style={{ background: 'transparent', padding: '10px 0' }}>
            <div className="animacion-entrada" style={{ width: '100%', margin: '0 auto' }}>
                
                <style>{`
                    .animacion-entrada { animation: fadeInNova 0.6s ease-out forwards; }
                    @keyframes fadeInNova { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
                    .card-resumen-nova { background: white; border-radius: 12px; padding: 25px; box-shadow: 0 4px 6px rgba(0,0,0,0.03); border-top: 5px solid #1A365D; transition: transform 0.3s; }
                    .card-resumen-nova:hover { transform: translateY(-5px); }
                    .tabla-clinica-nova { width: 100%; border-collapse: collapse; background: white; }
                    .tabla-clinica-nova th { background: #1A365D; color: white; padding: 18px; text-align: left; text-transform: uppercase; font-size: 12px; letter-spacing: 0.5px; }
                    .tabla-clinica-nova td { padding: 16px; border-bottom: 1px solid #EDF2F7; color: #4A5568; font-size: 14px; }
                    .fila-nova:hover { background-color: #F7FAFC; }
                    .btn-ia-nova { background: #00A8CC; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-weight: 800; transition: 0.3s; }
                    .btn-ia-nova:hover { background: #008AA8; box-shadow: 0 4px 10px rgba(0, 168, 204, 0.3); }
                    .input-buscar-nova:focus { border-color: #00A8CC !important; box-shadow: 0 0 0 3px rgba(0, 168, 204, 0.15) !important; }
                `}</style>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', ...theme.card, padding: '20px 35px', marginBottom: '25px', borderLeft: '8px solid #1A365D' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div style={{ background: '#1A365D', padding: '10px', borderRadius: '12px', marginRight: '15px' }}>
                            <svg width="35" height="35" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect width="100" height="100" rx="18" fill="#FFFFFF"/>
                                <path d="M28 72 V28 L72 72 V28" stroke="#00A8CC" strokeWidth="12" strokeLinecap="square" strokeLinejoin="miter"/>
                            </svg>
                        </div>
                        <div style={{ textAlign: 'left' }}>
                            <h2 style={{ color: '#1A365D', margin: 0, fontWeight: '900', fontSize: '26px' }}>NovaSalud</h2>
                            <span style={{ color: '#718096', fontSize: '12px', fontWeight: '700', letterSpacing: '1px' }}>CENTRO DE COMANDO MÉDICO</span>
                        </div>
                    </div>
                    <button onClick={exportarPDFMaestro} disabled={pacientesFiltrados.length === 0} style={{ backgroundColor: pacientesFiltrados.length === 0 ? '#CBD5E0' : '#1A365D', color: 'white', padding: '14px 28px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '10px', transition: '0.3s' }}>
                        <Icon name="download" size={16} color="white" /> Exportar Reporte de Clínica
                    </button>
                </div>

                <PacienteRiesgoResumen pacientes={pacientes} datosGrafico={datosGrafico} />

                <div style={{ textAlign: 'left', marginBottom: '25px' }}>
                    <input data-cy="buscar-paciente" className="input-buscar-nova" type="text" placeholder="Buscar expediente por Nombre, Apellido o DNI..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} style={{ width: '45%', padding: '16px 25px 16px 48px', borderRadius: '35px', border: '2px solid #E2E8F0', outline: 'none', background: 'white', fontSize: '15px', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }} />
                </div>

                <div style={{ borderRadius: '15px', overflow: 'hidden', boxShadow: '0 10px 25px rgba(0,0,0,0.06)', background: 'white' }}>
                    <table data-cy="tabla-pacientes" className="tabla-clinica-nova">
                        <thead>
                            <tr>
                                <th>EXPEDIENTE</th><th>DNI</th><th>PACIENTE REGISTRADO</th><th>RIESGO IA</th><th style={{ textAlign: 'center' }}>GESTIÓN MÉDICA</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pacientesFiltrados.length === 0 ? (
                                <tr><td colSpan="5" style={{ padding: '40px', color: '#A0AEC0', fontStyle: 'italic', textAlign: 'center' }}>No se encontraron registros en la unidad.</td></tr>
                            ) : (
                                pacientesFiltrados.map(p => (
                                    <tr key={p.id} className="fila-nova">
                                        <td style={{ fontWeight: '800', color: '#2D3748' }}>{p.historiaClinica ? p.historiaClinica.split(' | ')[0] : 'HC-NEW'}</td>
                                        <td>{p.dni}</td>
                                        <td style={{ color: '#1A365D', fontWeight: '800' }}>{`${p.nombre} ${p.apellidoPaterno}`}</td>
                                        <td>
                                            <span style={{ padding: '6px 14px', borderRadius: '20px', fontSize: '11px', fontWeight: '900', background: p.riesgoPredicho === 'ALTO' ? '#FFF5F5' : p.riesgoPredicho === 'MEDIO' ? '#FFFBEB' : '#F0FFF4', color: p.riesgoPredicho === 'ALTO' ? '#C53030' : p.riesgoPredicho === 'MEDIO' ? '#B45309' : '#2F855A', border: `1px solid ${p.riesgoPredicho === 'ALTO' ? '#FEB2B2' : '#C6F6D5'}` }}>
                                                {p.riesgoPredicho || 'PENDIENTE'}
                                            </span>
                                        </td>
                                        <td style={{ textAlign: 'center', display: 'flex', justifyContent: 'center', gap: '10px' }}>
                                            <button data-cy="btn-analisis-ia" className="btn-ia-nova" onClick={() => setPacienteSeleccionado(p)} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}><Icon name="brain" size={14} color="white" /> ANÁLISIS IA</button>
                                            <button onClick={() => iniciarEdicion(p)} style={{ background: '#ED8936', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', display: 'inline-flex', alignItems: 'center', gap: '6px' }}><Icon name="edit" size={14} color="white" /> EDITAR</button>
                                            <button onClick={() => eliminarPaciente(p.id, p.nombre)} style={{ background: '#E53E3E', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', display: 'inline-flex', alignItems: 'center', gap: '6px' }}><Icon name="trash" size={14} color="white" /> ELIMINAR</button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {pacienteSeleccionado && (
                    <div data-cy="panel-analisis-ia" className="animacion-entrada" style={{ backgroundColor: '#1A365D', padding: '35px', borderRadius: '20px', marginTop: '35px', color: 'white', textAlign: 'left', boxShadow: '0 15px 35px rgba(26, 54, 93, 0.3)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.15)', paddingBottom: '15px', marginBottom: '25px' }}>
                            <h3 style={{ margin: 0, fontSize: '22px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <Icon name="brain" size={22} color="white" />
                                Diagnóstico NovaSalud: {pacienteSeleccionado.nombre} {pacienteSeleccionado.apellidoPaterno}
                            </h3>
                            <button onClick={() => setPacienteSeleccionado(null)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', opacity: 0.7, display: 'flex' }} title="Cerrar"><Icon name="close" size={22} color="white" /></button>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '30px' }}>
                            <div style={{ background: 'white', padding: '30px', borderRadius: '15px', textAlign: 'center', color: '#2D3748' }}>
                                <div style={{ display: 'inline-block', padding: '15px 35px', borderRadius: '50px', fontSize: '1.4em', fontWeight: '900', color: 'white', backgroundColor: pacienteSeleccionado.riesgoPredicho === 'ALTO' ? '#E53E3E' : '#38A169', boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }}>
                                    {pacienteSeleccionado.riesgoPredicho || 'NORMAL'}
                                </div>
                                <div style={{ marginTop: '25px', textAlign: 'left', fontSize: '14px', lineHeight: '1.8' }}>
                                    <p style={{ borderBottom: '1px solid #EDF2F7', paddingBottom: '8px' }}><b>N° Expediente:</b> <span style={{ float: 'right', color: '#00A8CC' }}>{pacienteSeleccionado.historiaClinica?.split(' | ')[0]}</span></p>
                                    <p style={{ borderBottom: '1px solid #EDF2F7', paddingBottom: '8px' }}><b>Unidad/Cama:</b> <span style={{ float: 'right' }}>{pacienteSeleccionado.numeroCama}</span></p>
                                    <p style={{ borderBottom: '1px solid #EDF2F7', paddingBottom: '8px' }}><b>Fecha Ingreso:</b> <span style={{ float: 'right' }}>{pacienteSeleccionado.fechaRegistro}</span></p>
                                    <p><b>Alergias:</b> <span style={{ float: 'right', color: '#E53E3E', fontWeight: 'bold' }}>{pacienteSeleccionado.alergiasConocidas}</span></p>
                                </div>
                            </div>
                            <div style={{ background: 'white', padding: '30px', borderRadius: '15px', color: '#2D3748' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                    <h4 style={{ margin: 0, fontSize: '18px', color: '#1A365D', display: 'flex', alignItems: 'center', gap: '8px' }}><Icon name="lightbulb" size={18} color="#1A365D" /> Protocolo Médico Sugerido</h4>
                                    <button onClick={() => exportarPDFIndividual(pacienteSeleccionado)} style={{ background: '#38A169', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', display: 'inline-flex', alignItems: 'center', gap: '8px' }}><Icon name="file" size={16} color="white" /> Exportar Ficha + Firma</button>
                                </div>
                                <div style={{ padding: '20px', borderLeft: '5px solid #00A8CC', background: '#F8FAFC', fontStyle: 'italic', color: '#4A5568', fontSize: '16px', lineHeight: '1.6' }}>
                                    <span data-cy="texto-recomendacion-ia">"{pacienteSeleccionado.recomendacionIa || 'Análisis en proceso por el motor NovaSalud.'}"</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {pacienteAEditar && (
                    <PacienteEditModal
                        paciente={pacienteAEditar}
                        isSaving={isSavingEdit}
                        onChange={manejarCambioEdicion}
                        onSave={guardarEdicion}
                        onClose={() => setPacienteAEditar(null)}
                    />
                )}
            </div>
        </div>
    );
};

export default ListaPacientes;