import React, { useState, useEffect } from 'react';
import PacienteService from '../services/PacienteService';
import Swal from 'sweetalert2'; 

const FormularioPaciente = () => {
    // Estados base
    const [nombre, setNombre] = useState('');
    const [apellidoPaterno, setApellidoPaterno] = useState('');
    const [apellidoMaterno, setApellidoMaterno] = useState('');
    const [dni, setDni] = useState('');
    const [edad, setEdad] = useState('');
    const [sexo, setSexo] = useState(''); 
    const [tipoSangre, setTipoSangre] = useState('');
    const [alergiasConocidas, setAlergiasConocidas] = useState('');
    
    const [idDoctor, setIdDoctor] = useState('');
    const [especialidad, setEspecialidad] = useState('');
    const [dniError, setDniError] = useState('');
    
    const [isLoading, setIsLoading] = useState(false); 

    // Estados de especialidades
    const [presionArterial, setPresionArterial] = useState('');
    const [frecuenciaCardiaca, setFrecuenciaCardiaca] = useState('');
    const [colesterol, setColesterol] = useState('');
    const [pesoNacer, setPesoNacer] = useState('');
    const [nombreTutor, setNombreTutor] = useState('');
    const [vacunasAlDia, setVacunasAlDia] = useState('');
    const [escalaGlasgow, setEscalaGlasgow] = useState('');
    const [frecuenciaCefaleas, setFrecuenciaCefaleas] = useState('');
    const [zonaLesion, setZonaLesion] = useState('');
    const [nivelDolor, setNivelDolor] = useState('');
    const [motivoConsulta, setMotivoConsulta] = useState(''); 
    const [temperatura, setTemperatura] = useState('');

    useEffect(() => {
        const doctorGuardado = localStorage.getItem('doctorLogueado');
        if (doctorGuardado) {
            const doctor = JSON.parse(doctorGuardado);
            setIdDoctor(doctor.id);
            setEspecialidad(doctor.especialidad);
        }
    }, []);

    const handleTextChange = (valor, setter) => {
        const soloLetras = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]*$/;
        if (soloLetras.test(valor) && valor.length <= 20) { setter(valor); }
    };

    const handleDniChange = (e) => {
        const valor = e.target.value;
        if (!/^\d*$/.test(valor)) return; 
        setDni(valor);
        setDniError(valor.length > 0 && valor.length !== 8 ? 'El DNI debe tener 8 dígitos.' : '');
    };

    const guardarPaciente = (e) => {
        e.preventDefault();

        if (especialidad === 'Pediatría' && (pesoNacer < 0.5 || pesoNacer > 6.0)) {
            return Swal.fire('Peso Inválido', 'El peso al nacer debe estar entre 0.5 kg y 6.0 kg.', 'warning');
        }
        if (especialidad === 'Cardiología' && (frecuenciaCardiaca < 30 || frecuenciaCardiaca > 250)) {
            return Swal.fire('Frecuencia Inválida', 'La frecuencia cardíaca debe estar entre 30 y 250 bpm.', 'warning');
        }
        if (especialidad === 'Traumatología' && !zonaLesion) {
            return Swal.fire('Dato Incompleto', 'Debe seleccionar una zona del cuerpo humano.', 'warning');
        }
        if (especialidad === 'Neurología' && (escalaGlasgow < 3 || escalaGlasgow > 15)) {
            return Swal.fire('Rango Inválido', 'La escala de Glasgow solo acepta valores entre 3 y 15.', 'warning');
        }
        if (especialidad === 'Medicina General' && (temperatura < 34 || temperatura > 43)) {
            return Swal.fire('Rango Inválido', 'Temperatura fuera de rango vital.', 'warning');
        }
        if (especialidad === 'Cardiología' && presionArterial && !/^\d{2,3}\/\d{2,3}$/.test(presionArterial)) {
            return Swal.fire('Formato Incorrecto', 'Formato de presión inválido (Ej: 120/80).', 'warning');
        }
        
        if (!idDoctor) return Swal.fire('Error', 'Error de sesión. Vuelva a ingresar.', 'error');
        if (dni.length !== 8) return;

        setIsLoading(true); 

        const numeroCamaGenerado = Math.floor(Math.random() * 100) + 1; 
        const historiaClinicaGenerada = "HC-" + Math.floor(10000 + Math.random() * 90000); 
        const ahora = new Date();
        const fechaActual = ahora.toLocaleDateString() + ' ' + ahora.toLocaleTimeString(); 

        let nuevoPaciente = { 
            nombre: nombre.trim(), apellidoPaterno: apellidoPaterno.trim(), apellidoMaterno: apellidoMaterno.trim(), 
            dni, edad: parseInt(edad), sexo, tipoSangre, alergiasConocidas: alergiasConocidas || "Ninguna",
            numeroCama: numeroCamaGenerado, historiaClinica: historiaClinicaGenerada, fechaRegistro: fechaActual, idDoctor
        };

        switch (especialidad) {
            case 'Cardiología': nuevoPaciente = { ...nuevoPaciente, presionArterial, frecuenciaCardiaca, colesterol }; break;
            case 'Pediatría': nuevoPaciente = { ...nuevoPaciente, pesoNacer, nombreTutor, vacunasAlDia }; break;
            case 'Neurología': nuevoPaciente = { ...nuevoPaciente, escalaGlasgow, frecuenciaCefaleas }; break;
            case 'Traumatología': nuevoPaciente = { ...nuevoPaciente, zonaLesion, nivelDolor, motivoConsulta }; break;
            case 'Medicina General': nuevoPaciente = { ...nuevoPaciente, motivoConsulta, temperatura }; break;
            default: break;
        }

        PacienteService.registrarPaciente(nuevoPaciente)
            .then(() => {
                Swal.fire({
                    title: '¡Registro Exitoso!',
                    html: `Paciente registrado.<br><b>Cama:</b> ${numeroCamaGenerado}<br><b>HC:</b> ${historiaClinicaGenerada}`,
                    icon: 'success',
                    confirmButtonColor: '#1A365D'
                }).then(() => {
                    window.location.reload(); 
                });
            })
            .catch(() => {
                Swal.fire('Error de Registro', 'El DNI ya se encuentra registrado en el sistema.', 'error');
                setIsLoading(false); 
            });
    };

    const inputBaseStyle = { width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #CBD5E1', boxSizing: 'border-box', outline: 'none', backgroundColor: '#F8FAFC' };
    const labelStyle = { fontWeight: '800', display: 'block', marginBottom: '6px', fontSize: '11px', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px' };

    return (
        <div style={{ backgroundColor: '#F1F5F9', minHeight: '100vh', padding: '40px 0' }}>
            <div className="animacion-entrada" style={{ margin: '0 auto', width: '90%', maxWidth: '950px', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 15px 35px rgba(26, 54, 93, 0.12)', backgroundColor: '#FFFFFF' }}>
                
                <style>{`
                    .animacion-entrada { animation: slideUp 0.6s ease-out forwards; }
                    @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
                    .header-form { background: #1A365D; padding: 30px; color: white; display: flex; alignItems: center; }
                    .input-clinico:focus { border-color: #00A8CC !important; box-shadow: 0 0 0 3px rgba(0, 168, 204, 0.1); background: white !important; }
                    .section-box { padding: 25px; border-radius: 12px; margin-top: 20px; border-left: 6px solid #1A365D; }
                `}</style>

                <div className="header-form">
                    <svg width="45" height="45" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '20px' }}>
                        <rect width="100" height="100" rx="18" fill="#FFFFFF"/>
                        <path d="M28 72 V28 L72 72 V28" stroke="#00A8CC" strokeWidth="12" strokeLinecap="square" strokeLinejoin="miter"/>
                    </svg>
                    <div>
                        <h2 style={{ margin: 0, fontSize: '24px', letterSpacing: '-0.5px' }}>Nueva Historia Clínica</h2>
                        <span style={{ fontSize: '13px', color: '#00A8CC', fontWeight: 'bold' }}>NovaSalud | Especialidad de {especialidad}</span>
                    </div>
                </div>

                <form onSubmit={guardarPaciente} style={{ padding: '40px' }}>
                    <h4 style={{ color: '#1A365D', borderBottom: '2px solid #E2E8F0', paddingBottom: '10px', marginBottom: '25px', fontSize: '14px', textTransform: 'uppercase' }}>📝 Datos Generales del Paciente</h4>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                        <div><label style={labelStyle}>Nombres</label><input className="input-clinico" type="text" value={nombre} onChange={(e) => handleTextChange(e.target.value, setNombre)} required style={inputBaseStyle} disabled={isLoading}/></div>
                        <div><label style={labelStyle}>Ap. Paterno</label><input className="input-clinico" type="text" value={apellidoPaterno} onChange={(e) => handleTextChange(e.target.value, setApellidoPaterno)} required style={inputBaseStyle} disabled={isLoading}/></div>
                        <div><label style={labelStyle}>Ap. Materno</label><input className="input-clinico" type="text" value={apellidoMaterno} onChange={(e) => handleTextChange(e.target.value, setApellidoMaterno)} required style={inputBaseStyle} disabled={isLoading}/></div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr 1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                        <div>
                            <label style={labelStyle}>DNI / Documento</label>
                            <input className="input-clinico" type="text" value={dni} onChange={handleDniChange} maxLength="8" required style={{ ...inputBaseStyle, border: dniError ? '2px solid #E53E3E' : '1px solid #CBD5E1' }} disabled={isLoading}/>
                            {dniError && <span style={{ color: '#E53E3E', fontSize: '10px', fontWeight: 'bold' }}>{dniError}</span>}
                        </div>
                        <div><label style={labelStyle}>Edad</label><input className="input-clinico" type="number" value={edad} onChange={(e) => setEdad(e.target.value)} required min="0" max="120" style={inputBaseStyle} disabled={isLoading}/></div>
                        <div>
                            <label style={labelStyle}>Sexo</label>
                            <select className="input-clinico" value={sexo} onChange={(e) => setSexo(e.target.value)} required style={{...inputBaseStyle, background: 'white'}} disabled={isLoading}>
                                <option value="">Seleccionar...</option><option value="Masculino">Masculino</option><option value="Femenino">Femenino</option>
                            </select>
                        </div>
                        <div>
                            <label style={labelStyle}>G. Sanguíneo</label>
                            <select className="input-clinico" value={tipoSangre} onChange={(e) => setTipoSangre(e.target.value)} required style={{...inputBaseStyle, background: 'white'}} disabled={isLoading}>
                                <option value="">Tipo...</option><option value="O+">O+</option><option value="O-">O-</option><option value="A+">A+</option><option value="A-">A-</option><option value="B+">B+</option><option value="B-">B-</option><option value="AB+">AB+</option><option value="AB-">AB-</option>
                            </select>
                        </div>
                    </div>

                    {/* ======================================================= */}
                    {/* AQUÍ ESTÁ EL NUEVO INPUT CON SUGERENCIAS (DATALIST) */}
                    {/* ======================================================= */}
                    <div style={{ marginBottom: '30px' }}>
                        <label style={labelStyle}>Alergias Conocidas</label>
                        <input 
                            className="input-clinico" 
                            type="text" 
                            list="sugerencias-alergias"
                            value={alergiasConocidas} 
                            onChange={(e) => setAlergiasConocidas(e.target.value)} 
                            placeholder="Ej: Penicilina, Látex, Ninguna..." 
                            style={inputBaseStyle} 
                            disabled={isLoading}
                        />
                        <datalist id="sugerencias-alergias">
                            <option value="Ninguna" />
                            <option value="Desconocidas" />
                            <option value="Penicilina" />
                            <option value="AINEs (Ibuprofeno, Aspirina)" />
                            <option value="Anestesia local o general" />
                            <option value="Látex" />
                            <option value="Mariscos / Pescado" />
                            <option value="Frutos secos (Maní, Nueces)" />
                        </datalist>
                    </div>

                    {especialidad === 'Cardiología' && ( 
                        <div className="section-box" style={{ backgroundColor: '#F0F9FF', borderColor: '#00A8CC' }}> 
                            <h4 style={{ color: '#1A365D', margin: '0 0 15px 0' }}>🩺 Triaje Cardiológico</h4> 
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}> 
                                <div><label style={labelStyle}>Presión (mmHg)</label><input className="input-clinico" type="text" value={presionArterial} onChange={(e)=>setPresionArterial(e.target.value)} style={inputBaseStyle} disabled={isLoading} /></div> 
                                <div><label style={labelStyle}>Frecuencia (bpm)</label><input className="input-clinico" type="number" value={frecuenciaCardiaca} onChange={(e)=>setFrecuenciaCardiaca(e.target.value)} style={inputBaseStyle} disabled={isLoading} /></div> 
                                <div><label style={labelStyle}>Colesterol</label><input className="input-clinico" type="text" value={colesterol} onChange={(e)=>setColesterol(e.target.value)} style={inputBaseStyle} disabled={isLoading} /></div>
                            </div> 
                        </div> 
                    )}
                    {especialidad === 'Pediatría' && ( 
                        <div className="section-box" style={{ backgroundColor: '#F0FFF4', borderColor: '#38A169' }}> 
                            <h4 style={{ color: '#22543D', margin: '0 0 15px 0' }}>🧸 Ficha Pediátrica</h4> 
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}> 
                                <div><label style={labelStyle}>Peso Nacer (kg)</label><input className="input-clinico" type="number" step="0.1" value={pesoNacer} onChange={(e)=>setPesoNacer(e.target.value)} style={inputBaseStyle} disabled={isLoading} /></div> 
                                <div><label style={labelStyle}>Tutor Legal</label><input className="input-clinico" type="text" value={nombreTutor} onChange={(e)=>setNombreTutor(e.target.value)} style={inputBaseStyle} disabled={isLoading} /></div> 
                                <div><label style={labelStyle}>Vacunas</label><input className="input-clinico" type="text" value={vacunasAlDia} onChange={(e)=>setVacunasAlDia(e.target.value)} style={inputBaseStyle} disabled={isLoading} /></div>
                            </div> 
                        </div> 
                    )}
                    {especialidad === 'Neurología' && ( 
                        <div className="section-box" style={{ backgroundColor: '#F5F3FF', borderColor: '#8B5CF6' }}> 
                            <h4 style={{ color: '#4C1D95', margin: '0 0 15px 0' }}>🧠 Evaluación Neurológica</h4> 
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}> 
                                <div><label style={labelStyle}>Glasgow (3-15)</label><input className="input-clinico" type="number" value={escalaGlasgow} onChange={(e)=>setEscalaGlasgow(e.target.value)} style={inputBaseStyle} disabled={isLoading} /></div> 
                                <div><label style={labelStyle}>Frec. Cefaleas</label><input className="input-clinico" type="text" value={frecuenciaCefaleas} onChange={(e)=>setFrecuenciaCefaleas(e.target.value)} style={inputBaseStyle} disabled={isLoading} /></div> 
                            </div> 
                        </div> 
                    )}

                    {especialidad === 'Traumatología' && ( 
                        <div style={{ padding: '25px', borderRadius: '12px', background: '#FFF7ED', borderLeft: '6px solid #ED8936', marginTop: '20px' }}> 
                            <h4 style={{ color: '#7C2D12', margin: '0 0 15px 0' }}>🦴 Evaluación de Lesión Traumática</h4> 
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}> 
                                <div>
                                    <label style={labelStyle}>Zona Anatómica Principal</label>
                                    <select className="input-clinico" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #CBD5E1', background: 'white' }} value={zonaLesion} onChange={(e)=>setZonaLesion(e.target.value)} required disabled={isLoading}>
                                        <option value="">-- Seleccione parte del cuerpo --</option>
                                        <option value="Cráneo / Cabeza">Cráneo / Cabeza</option>
                                        <option value="Hombro">Hombro</option>
                                        <option value="Brazo / Húmero">Brazo / Húmero</option>
                                        <option value="Codo">Codo</option>
                                        <option value="Muñeca / Mano">Muñeca / Mano</option>
                                        <option value="Columna / Espalda">Columna / Espalda</option>
                                        <option value="Pelvis / Cadera">Pelvis / Cadera</option>
                                        <option value="Fémur / Muslo">Fémur / Muslo</option>
                                        <option value="Rodilla">Rodilla</option>
                                        <option value="Tobillo / Pie">Tobillo / Pie</option>
                                        <option value="Multiples Zonas">Múltiples Zonas</option>
                                    </select>
                                </div> 
                                <div><label style={labelStyle}>Nivel Dolor (1-10)</label><input className="input-clinico" style={inputBaseStyle} type="number" min="1" max="10" value={nivelDolor} onChange={(e)=>setNivelDolor(e.target.value)} required disabled={isLoading} /></div> 
                            </div> 
                            <div style={{ marginTop: '20px' }}>
                                <label style={labelStyle}>Detalles Clínicos (Escritura Manual para el Médico)</label>
                                <textarea className="input-clinico" style={{ ...inputBaseStyle, height: '80px', resize: 'none' }} value={motivoConsulta} onChange={(e) => setMotivoConsulta(e.target.value)} placeholder="Ej: Paciente presenta dolor punzante tras caída, posible fisura expuesta..." required disabled={isLoading} />
                            </div>
                        </div> 
                    )}

                    {especialidad === 'Medicina General' && ( 
                        <div className="section-box" style={{ backgroundColor: '#FFF5F5', borderColor: '#E53E3E' }}> 
                            <h4 style={{ color: '#742A2A', margin: '0 0 15px 0' }}>🩺 Triaje General</h4> 
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}> 
                                <div><label style={labelStyle}>Temperatura (°C)</label><input className="input-clinico" type="number" step="0.1" value={temperatura} onChange={(e)=>setTemperatura(e.target.value)} style={inputBaseStyle} disabled={isLoading} /></div> 
                                <div><label style={labelStyle}>Motivo Consulta</label><input className="input-clinico" type="text" value={motivoConsulta} onChange={(e)=>setMotivoConsulta(e.target.value)} style={inputBaseStyle} disabled={isLoading} /></div> 
                            </div> 
                        </div> 
                    )}

                    <button type="submit" disabled={isLoading} style={{ width: '100%', padding: '18px', background: isLoading ? '#718096' : '#1A365D', color: 'white', border: 'none', borderRadius: '10px', fontSize: '16px', fontWeight: '800', cursor: isLoading ? 'wait' : 'pointer', marginTop: '30px', boxShadow: isLoading ? 'none' : '0 4px 15px rgba(26, 54, 93, 0.3)', transition: 'all 0.3s' }}>
                        {isLoading ? '⏳ REGISTRANDO EN NOVASALUD...' : 'FINALIZAR Y GUARDAR'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default FormularioPaciente;