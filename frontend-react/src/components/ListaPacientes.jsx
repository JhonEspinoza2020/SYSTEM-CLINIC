import React, { useEffect, useState } from 'react';
import PacienteService from '../services/PacienteService';
import axios from 'axios';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Swal from 'sweetalert2'; 

const ListaPacientes = () => {
    const [pacientes, setPacientes] = useState([]);
    const [pacienteSeleccionado, setPacienteSeleccionado] = useState(null);
    const [pacienteAEditar, setPacienteAEditar] = useState(null);
    const [busqueda, setBusqueda] = useState('');
    
    const [isSavingEdit, setIsSavingEdit] = useState(false); 

    useEffect(() => { cargarPacientes(); }, []);

    const cargarPacientes = () => {
        const doctorGuardado = localStorage.getItem('doctorLogueado');
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
                axios.delete(`http://localhost:8080/api/pacientes/${id}`).then(() => {
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

    const calcularDatosGrafico = () => {
        let alto = 0, medio = 0, bajo = 0, sinEvaluar = 0;
        pacientes.forEach(p => {
            if (p.riesgoPredicho === 'ALTO') alto++;
            else if (p.riesgoPredicho === 'MEDIO') medio++;
            else if (p.riesgoPredicho === 'BAJO') bajo++;
            else sinEvaluar++;
        });
        return [
            { name: 'Crítico (Alto)', value: alto, color: '#E53E3E' },
            { name: 'Observación (Medio)', value: medio, color: '#ED8936' },
            { name: 'Estable (Bajo)', value: bajo, color: '#38A169' },
            ...(sinEvaluar > 0 ? [{ name: 'Sin Datos', value: sinEvaluar, color: '#A0AEC0' }] : [])
        ];
    };
    const datosGrafico = calcularDatosGrafico();

    const generarPDFMaestro = () => {
        if (pacientesFiltrados.length === 0) {
            return Swal.fire('Sin datos', 'No hay registros médicos en la vista actual para exportar.', 'info');
        }
        const doc = new jsPDF();
        const doctor = JSON.parse(localStorage.getItem('doctorLogueado'));

        doc.setFontSize(10); doc.setTextColor(0, 168, 204); doc.setFont("helvetica", "bold");
        doc.text("NOVASALUD | RED HOSPITALARIA NACIONAL", 14, 12);
        
        doc.setFontSize(20); doc.setTextColor(26, 54, 93);
        doc.text("REPORTE CLÍNICO CONSOLIDADO", 105, 25, { align: "center" });

        doc.setFontSize(11); doc.setTextColor(74, 85, 104); doc.setFont("helvetica", "normal");
        doc.text(`Médico Responsable: Dr(a). ${doctor.nombreCompleto}`, 14, 38);
        doc.text(`Departamento: ${doctor.especialidad}`, 14, 44);
        doc.text(`Total de Pacientes: ${pacientesFiltrados.length}`, 140, 38);
        doc.text(`Fecha de Emisión: ${new Date().toLocaleDateString()}`, 140, 44);

        doc.setLineWidth(0.5); doc.setDrawColor(203, 213, 224);
        doc.line(14, 49, 196, 49);

        const tableColumn = ["Historia", "DNI", "Paciente", "Edad", "Sexo", "Riesgo IA", "Ingreso"];
        const tableRows = pacientesFiltrados.map(p => [
            p.historiaClinica || 'N/A', p.dni, `${p.nombre} ${p.apellidoPaterno}`, p.edad,
            p.sexo ? p.sexo.charAt(0) : '-', p.riesgoPredicho || 'N/E', p.fechaRegistro ? p.fechaRegistro.split(' ')[0] : 'N/A'
        ]);

        autoTable(doc, {
            head: [tableColumn], body: tableRows, startY: 55, theme: 'striped',
            headStyles: { fillColor: [26, 54, 93], textColor: 255 }, styles: { fontSize: 9, cellPadding: 3 }
        });

        doc.save(`Reporte_NovaSalud_${doctor.nombreCompleto.replace(/\s/g, '_')}.pdf`);
    };

    const generarPDFIndividual = (paciente) => {
        const doc = new jsPDF();
        const doctor = JSON.parse(localStorage.getItem('doctorLogueado'));

        doc.setFontSize(10); doc.setTextColor(0, 168, 204); doc.setFont("helvetica", "bold");
        doc.text("NOVASALUD | SISTEMA DE EVALUACIÓN PREDICTIVA", 14, 12);

        doc.setFontSize(22); doc.setTextColor(26, 54, 93);
        doc.text("EXPEDIENTE CLÍNICO DIGITAL", 105, 25, { align: "center" });

        doc.setFontSize(11); doc.setTextColor(100); doc.setFont("helvetica", "normal");
        doc.text(`Especialista Tratante: Dr(a). ${doctor.nombreCompleto} (${doctor.especialidad})`, 105, 33, { align: "center" });

        const filasPDF = [
            ["Nombre Completo:", `${paciente.nombre} ${paciente.apellidoPaterno} ${paciente.apellidoMaterno}`],
            ["Identidad (DNI):", paciente.dni],
            ["N° de Historia Clínica:", paciente.historiaClinica || 'Sin asignar'],
            ["Unidad / Cama:", paciente.numeroCama || 'Atención Ambulatoria'],
            ["Fecha de Registro:", paciente.fechaRegistro || 'N/A'],
            ["Perfil Biológico:", `${paciente.edad} años | Sexo: ${paciente.sexo || 'N/A'} | Sangre: ${paciente.tipoSangre}`],
            ["Antecedentes Alérgicos:", paciente.alergiasConocidas || 'Negativo']
        ];

        if (paciente.zonaLesion) {
            filasPDF.push(["ZONA AFECTADA:", paciente.zonaLesion.toUpperCase()]);
            filasPDF.push(["NIVEL DE DOLOR:", `${paciente.nivelDolor || '0'} / 10`]);
            if (paciente.motivoConsulta) {
                filasPDF.push(["NOTAS DEL MÉDICO:", paciente.motivoConsulta]);
            }
        }

        if (paciente.presionArterial) {
            filasPDF.push(["PRESIÓN ARTERIAL:", paciente.presionArterial]);
            filasPDF.push(["FREC. CARDÍACA:", `${paciente.frecuenciaCardiaca} BPM`]);
        }

        autoTable(doc, {
            startY: 45, theme: 'plain', styles: { fontSize: 11, cellPadding: 4, textColor: [45, 55, 72] },
            columnStyles: { 0: { fontStyle: 'bold', cellWidth: 60, textColor: [26, 54, 93] } },
            body: filasPDF
        });

        const finalY = doc.lastAutoTable.finalY || 120;
        doc.setDrawColor(26, 54, 93); doc.setFillColor(247, 250, 252);
        doc.roundedRect(14, finalY + 10, 182, 65, 4, 4, 'FD'); 

        doc.setFontSize(14); doc.setTextColor(229, 62, 62); doc.setFont("helvetica", "bold");
        doc.text("VALIDACIÓN DE INTELIGENCIA ARTIFICIAL", 20, finalY + 22);

        doc.setFontSize(11); doc.setTextColor(45, 55, 72);
        doc.text(`Nivel de Riesgo Calculado: ${paciente.riesgoPredicho || 'Pendiente'}`, 20, finalY + 32);
        doc.text("Recomendación Médica Sugerida:", 20, finalY + 42);
        
        doc.setFont("helvetica", "italic");
        const recomendacion = doc.splitTextToSize(`"${paciente.recomendacionIa || 'Analizando...'}"`, 170);
        doc.text(recomendacion, 20, finalY + 50);

        doc.save(`Expediente_${paciente.dni}_NovaSalud.pdf`);
    };

    return (
        <div style={{ backgroundColor: '#F8FAFC', minHeight: '100vh', padding: '30px 0' }}>
            <div className="animacion-entrada" style={{ maxWidth: '1400px', margin: '0 auto', width: '95%' }}>
                
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

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FFFFFF', padding: '20px 35px', borderRadius: '15px', marginBottom: '25px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', borderLeft: '8px solid #1A365D' }}>
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
                    <button onClick={generarPDFMaestro} disabled={pacientesFiltrados.length === 0} style={{ backgroundColor: pacientesFiltrados.length === 0 ? '#CBD5E0' : '#1A365D', color: 'white', padding: '14px 28px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '10px', transition: '0.3s' }}>
                        📥 Exportar Data Hospitalaria
                    </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1.5fr', gap: '20px', marginBottom: '30px' }}>
                    <div className="card-resumen-nova" style={{ borderTopColor: '#00A8CC' }}>
                        <span style={{ fontSize: '12px', fontWeight: '800', color: '#718096' }}>POBLACIÓN ACTIVA</span>
                        <h2 style={{ fontSize: '42px', margin: '10px 0', color: '#1A365D' }}>{pacientes.length}</h2>
                        <p style={{ margin: 0, color: '#A0AEC0', fontSize: '13px' }}>Expedientes registrados</p>
                    </div>
                    <div className="card-resumen-nova" style={{ borderTopColor: '#E53E3E' }}>
                        <span style={{ fontSize: '12px', fontWeight: '800', color: '#718096' }}>ALERTAS CRÍTICAS (IA)</span>
                        <h2 style={{ fontSize: '42px', margin: '10px 0', color: '#E53E3E' }}>{datosGrafico[0].value}</h2>
                        <p style={{ margin: 0, color: '#A0AEC0', fontSize: '13px' }}>Casos de riesgo alto</p>
                    </div>
                    <div className="card-resumen-nova" style={{ display: 'flex', alignItems: 'center' }}>
                        <div style={{ flex: 1, height: '140px' }}>
                            <ResponsiveContainer>
                                <PieChart>
                                    <Pie data={datosGrafico} innerRadius={40} outerRadius={60} dataKey="value" stroke="none">
                                        {datosGrafico.map((e, i) => <Cell key={i} fill={e.color} />)}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div style={{ paddingLeft: '25px', textAlign: 'left' }}>
                            {datosGrafico.map(g => (
                                <div key={g.name} style={{ fontSize: '11px', marginBottom: '5px', color: '#4A5568', fontWeight: 'bold' }}>
                                    <span style={{ color: g.color }}>●</span> {g.name}: {g.value}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div style={{ textAlign: 'left', marginBottom: '25px' }}>
                    <input className="input-buscar-nova" type="text" placeholder="🔍 Buscar expediente por Nombre, Apellido o DNI..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} style={{ width: '45%', padding: '16px 25px', borderRadius: '35px', border: '2px solid #E2E8F0', outline: 'none', background: 'white', fontSize: '15px', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }} />
                </div>

                <div style={{ borderRadius: '15px', overflow: 'hidden', boxShadow: '0 10px 25px rgba(0,0,0,0.06)', background: 'white' }}>
                    <table className="tabla-clinica-nova">
                        <thead>
                            <tr>
                                <th>EXPEDIENTE</th><th>DNI</th><th>PACIENTE REGISTRADO</th><th>RIESGO IA</th><th style={{ textAlign: 'center' }}>GESTIÓN MÉDICA</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pacientesFiltrados.length === 0 ? (
                                <tr><td colSpan="5" style={{ padding: '40px', color: '#A0AEC0', fontStyle: 'italic' }}>No se encontraron registros coincidentes en la unidad.</td></tr>
                            ) : (
                                pacientesFiltrados.map(p => (
                                    <tr key={p.id} className="fila-nova">
                                        <td style={{ fontWeight: '800', color: '#2D3748' }}>{p.historiaClinica || 'HC-NEW'}</td>
                                        <td>{p.dni}</td>
                                        <td style={{ color: '#1A365D', fontWeight: '800' }}>{`${p.nombre} ${p.apellidoPaterno}`}</td>
                                        <td>
                                            <span style={{ padding: '6px 14px', borderRadius: '20px', fontSize: '11px', fontWeight: '900', background: p.riesgoPredicho === 'ALTO' ? '#FFF5F5' : p.riesgoPredicho === 'MEDIO' ? '#FFFBEB' : '#F0FFF4', color: p.riesgoPredicho === 'ALTO' ? '#C53030' : p.riesgoPredicho === 'MEDIO' ? '#B45309' : '#2F855A', border: `1px solid ${p.riesgoPredicho === 'ALTO' ? '#FEB2B2' : '#C6F6D5'}` }}>
                                                {p.riesgoPredicho || 'PENDIENTE'}
                                            </span>
                                        </td>
                                        <td style={{ textAlign: 'center', display: 'flex', justifyContent: 'center', gap: '10px' }}>
                                            <button className="btn-ia-nova" onClick={() => setPacienteSeleccionado(p)}>🧠 ANALISIS IA</button>
                                            <button onClick={() => iniciarEdicion(p)} style={{ background: '#ED8936', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>✏️EDITAR</button>
                                            <button onClick={() => eliminarPaciente(p.id, p.nombre)} style={{ background: '#E53E3E', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>🗑️ELIMINAR</button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {pacienteSeleccionado && (
                    <div className="animacion-entrada" style={{ backgroundColor: '#1A365D', padding: '35px', borderRadius: '20px', marginTop: '35px', color: 'white', textAlign: 'left', boxShadow: '0 15px 35px rgba(26, 54, 93, 0.3)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.15)', paddingBottom: '15px', marginBottom: '25px' }}>
                            <h3 style={{ margin: 0, fontSize: '22px', display: 'flex', alignItems: 'center' }}>
                                🧠 Diagnóstico NovaSalud: {pacienteSeleccionado.nombre} {pacienteSeleccionado.apellidoPaterno}
                            </h3>
                            <button onClick={() => setPacienteSeleccionado(null)} style={{ background: 'none', border: 'none', color: 'white', fontSize: '24px', cursor: 'pointer', opacity: 0.7 }}>✖</button>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '30px' }}>
                            <div style={{ background: 'white', padding: '30px', borderRadius: '15px', textAlign: 'center', color: '#2D3748' }}>
                                <div style={{ display: 'inline-block', padding: '15px 35px', borderRadius: '50px', fontSize: '1.4em', fontWeight: '900', color: 'white', backgroundColor: pacienteSeleccionado.riesgoPredicho === 'ALTO' ? '#E53E3E' : '#38A169', boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }}>
                                    {pacienteSeleccionado.riesgoPredicho || 'NORMAL'}
                                </div>
                                <div style={{ marginTop: '25px', textAlign: 'left', fontSize: '14px', lineHeight: '1.8' }}>
                                    <p style={{ borderBottom: '1px solid #EDF2F7', paddingBottom: '8px' }}><b>N° Expediente:</b> <span style={{ float: 'right', color: '#00A8CC' }}>{pacienteSeleccionado.historiaClinica}</span></p>
                                    <p style={{ borderBottom: '1px solid #EDF2F7', paddingBottom: '8px' }}><b>Unidad/Cama:</b> <span style={{ float: 'right' }}>{pacienteSeleccionado.numeroCama}</span></p>
                                    <p style={{ borderBottom: '1px solid #EDF2F7', paddingBottom: '8px' }}><b>Fecha Ingreso:</b> <span style={{ float: 'right' }}>{pacienteSeleccionado.fechaRegistro}</span></p>
                                    <p><b>Alergias:</b> <span style={{ float: 'right', color: '#E53E3E', fontWeight: 'bold' }}>{pacienteSeleccionado.alergiasConocidas}</span></p>
                                </div>
                            </div>
                            <div style={{ background: 'white', padding: '30px', borderRadius: '15px', color: '#2D3748' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                    <h4 style={{ margin: 0, fontSize: '18px', color: '#1A365D' }}>💡 Protocolo Médico Sugerido</h4>
                                    <button onClick={() => generarPDFIndividual(pacienteSeleccionado)} style={{ background: '#38A169', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>📄 Exportar Ficha</button>
                                </div>
                                <div style={{ padding: '20px', borderLeft: '5px solid #00A8CC', background: '#F8FAFC', fontStyle: 'italic', color: '#4A5568', fontSize: '16px', lineHeight: '1.6' }}>
                                    "{pacienteSeleccionado.recomendacionIa || 'Análisis en proceso por el motor NovaSalud.'}"
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {pacienteAEditar && (
                    <div className="animacion-entrada" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(26, 54, 93, 0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
                        <div style={{ backgroundColor: '#FFFFFF', padding: '40px', borderRadius: '20px', width: '100%', maxWidth: '550px', textAlign: 'left', boxShadow: '0 25px 50px rgba(0,0,0,0.3)', maxHeight: '90vh', overflowY: 'auto' }}>
                            <h3 style={{ marginTop: 0, color: '#1A365D', borderBottom: '2px solid #EDF2F7', paddingBottom: '15px', fontSize: '22px' }}>Actualizar Expediente Médico</h3>
                            <p style={{ fontSize: '12px', color: '#718096', marginBottom: '25px' }}>DNI y N° Historia bloqueados por protocolos de integridad NovaSalud.</p>
                            
                            <form onSubmit={guardarEdicion}>
                                <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
                                    <div style={{flex: 1}}><label style={labelModalStyle}>Nombres</label><input type="text" name="nombre" value={pacienteAEditar.nombre} onChange={manejarCambioEdicion} required style={inputModalStyle} disabled={isSavingEdit}/></div>
                                    <div style={{flex: 1}}><label style={labelModalStyle}>Apellidos</label><input type="text" name="apellidoPaterno" value={pacienteAEditar.apellidoPaterno} onChange={manejarCambioEdicion} required style={inputModalStyle} disabled={isSavingEdit}/></div>
                                </div>
                                
                                <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
                                    <div style={{flex: 1}}><label style={labelModalStyle}>Edad Actual</label><input type="number" name="edad" value={pacienteAEditar.edad} onChange={manejarCambioEdicion} required style={inputModalStyle} disabled={isSavingEdit}/></div>
                                    <div style={{flex: 1}}>
                                        <label style={labelModalStyle}>Género</label>
                                        <select name="sexo" value={pacienteAEditar.sexo || ''} onChange={manejarCambioEdicion} required style={inputModalStyle} disabled={isSavingEdit}>
                                            <option value="Masculino">Masculino</option><option value="Femenino">Femenino</option>
                                        </select>
                                    </div>
                                </div>

                                {/* ======================================================= */}
                                {/* AQUÍ ESTÁ EL INPUT CON SUGERENCIAS PARA EL MODAL DE EDICIÓN */}
                                {/* ======================================================= */}
                                <label style={labelModalStyle}>Cuadro de Alergias (Crítico para Diagnóstico IA)</label>
                                <input 
                                    type="text" 
                                    list="sugerencias-alergias-editar"
                                    name="alergiasConocidas" 
                                    value={pacienteAEditar.alergiasConocidas} 
                                    onChange={manejarCambioEdicion} 
                                    style={inputModalStyle} 
                                    disabled={isSavingEdit}
                                />
                                <datalist id="sugerencias-alergias-editar">
                                    <option value="Ninguna" />
                                    <option value="Desconocidas" />
                                    <option value="Penicilina" />
                                    <option value="AINEs (Ibuprofeno, Aspirina)" />
                                    <option value="Anestesia local o general" />
                                    <option value="Látex" />
                                    <option value="Mariscos / Pescado" />
                                    <option value="Frutos secos (Maní, Nueces)" />
                                </datalist>

                                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '35px' }}>
                                    <button type="button" onClick={() => setPacienteAEditar(null)} disabled={isSavingEdit} style={{ backgroundColor: '#CBD5E0', color: '#4A5568', border: 'none', padding: '14px 25px', borderRadius: '10px', cursor: isSavingEdit ? 'wait' : 'pointer', fontWeight: '800' }}>Cancelar</button>
                                    <button type="submit" disabled={isSavingEdit} style={{ backgroundColor: isSavingEdit ? '#718096' : '#00A8CC', color: '#FFFFFF', border: 'none', padding: '14px 25px', borderRadius: '10px', cursor: isSavingEdit ? 'wait' : 'pointer', fontWeight: '800', boxShadow: isSavingEdit ? 'none' : '0 4px 15px rgba(0, 168, 204, 0.4)', transition: '0.3s' }}>
                                        {isSavingEdit ? '⏳ EVALUANDO...' : 'GUARDAR Y REEVALUAR IA'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const labelModalStyle = { fontWeight: '800', color: '#4A5568', fontSize: '11px', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' };
const inputModalStyle = { width: '100%', padding: '14px', border: '1.5px solid #E2E8F0', borderRadius: '10px', outline: 'none', background: '#F8FAFC', fontSize: '15px' };

export default ListaPacientes;  