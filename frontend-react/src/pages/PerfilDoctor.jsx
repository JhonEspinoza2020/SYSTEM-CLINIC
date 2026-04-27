import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

const PerfilDoctor = () => {
    const [doctor, setDoctor] = useState({ nombreCompleto: '', dni: '', correo: '', especialidad: '', id: '' });
    const [passwords, setPasswords] = useState({ actual: '', nueva: '', confirmar: '' });
    const [mostrarPassword, setMostrarPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Cargar datos del doctor desde la sesión
        const doctorGuardado = localStorage.getItem('doctorLogueado');
        if (doctorGuardado) {
            const data = JSON.parse(doctorGuardado);
            setDoctor({
                id: data.id,
                nombreCompleto: data.nombreCompleto || data.nombre, 
                dni: data.dniDoctor || data.dni,
                correo: data.correo,
                especialidad: data.especialidad
            });
        } else {
            navigate('/'); // Si no hay sesión, patéalo al login
        }
    }, [navigate]);

    const handlePasswordChange = (e) => {
        setPasswords({ ...passwords, [e.target.name]: e.target.value });
    };

    const actualizarPassword = async (e) => {
        e.preventDefault();

        // Validaciones del Frontend
        if (passwords.nueva.length < 6) {
            return Swal.fire('Seguridad Débil', 'La nueva contraseña debe tener al menos 6 caracteres.', 'warning');
        }
        if (passwords.nueva !== passwords.confirmar) {
            return Swal.fire('Error', 'Las contraseñas nuevas no coinciden.', 'error');
        }
        if (passwords.actual === passwords.nueva) {
            return Swal.fire('Sin Cambios', 'La nueva contraseña no puede ser igual a la anterior.', 'info');
        }

        setIsLoading(true);

        try {
            // PASO 1: Verificamos que la contraseña "actual" ingresada sea correcta 
            // Hacemos un login silencioso usando el correo del doc y la clave que puso
            await axios.post('http://localhost:8080/api/auth/login', {
                correo: doctor.correo,
                password: passwords.actual
            });

            // PASO 2: Si el login pasó, significa que la clave actual es correcta. 
            // Ahora sí le decimos a Java que guarde la nueva.
            await axios.put('http://localhost:8080/api/auth/nueva-password', {
                correo: doctor.correo,
                password: passwords.nueva
            });

            // PASO 3: Éxito total
            Swal.fire({
                title: '¡Seguridad Actualizada!',
                text: 'Tu contraseña ha sido cambiada con éxito en la base de datos.',
                icon: 'success',
                confirmButtonColor: '#1A365D'
            });
            
            // Limpiamos los campos
            setPasswords({ actual: '', nueva: '', confirmar: '' });
            setIsLoading(false);

        } catch (err) {
            // Si el paso 1 falla, cae aquí.
            Swal.fire('Error', 'La contraseña actual es incorrecta o hubo un problema de conexión.', 'error');
            setIsLoading(false);
        }
    };

    const cerrarSesion = () => {
        Swal.fire({
            title: '¿Cerrar Sesión?',
            text: "Saldrás del sistema NovaSalud.",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#E53E3E',
            cancelButtonColor: '#718096',
            confirmButtonText: 'Sí, salir',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                localStorage.removeItem('doctorLogueado');
                navigate('/');
            }
        });
    };

    const labelStyle = { fontWeight: 'bold', color: '#ffffff', fontSize: '12px', display: 'block', marginBottom: '5px', textShadow: '0 1px 2px rgba(0,0,0,0.5)', textTransform: 'uppercase', letterSpacing: '0.5px' };
    const inputDisabledStyle = { width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', backgroundColor: 'rgba(255, 255, 255, 0.05)', color: '#a0aec0', outline: 'none', fontSize: '14px', cursor: 'not-allowed' };
    const inputStyle = { width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.4)', backgroundColor: 'rgba(255, 255, 255, 0.15)', color: '#ffffff', outline: 'none', fontSize: '14px', transition: 'all 0.3s' };

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
            
            {/* VIDEO DE FONDO Y CAPA OSCURA */}
            <video autoPlay loop muted playsInline style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: -2 }}>
                <source src="/NovaSalud.mp4" type="video/mp4" />
            </video>
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(15, 23, 42, 0.65)', zIndex: -1 }}></div>

            <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '700px', padding: '40px', borderRadius: '20px', backgroundColor: 'rgba(255, 255, 255, 0.10)', boxShadow: '0 20px 40px rgba(0,0,0,0.5)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.2)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                
                {/* COLUMNA IZQUIERDA: DATOS DEL DOCTOR (Solo lectura) */}
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '25px' }}>
                        <div style={{ background: '#1A365D', padding: '10px', borderRadius: '12px', marginRight: '15px' }}>
                            <svg width="30" height="30" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect width="100" height="100" rx="18" fill="#FFFFFF"/>
                                <path d="M28 72 V28 L72 72 V28" stroke="#00A8CC" strokeWidth="12" strokeLinecap="square" strokeLinejoin="miter"/>
                            </svg>
                        </div>
                        <div>
                            <h2 style={{ color: '#ffffff', margin: 0, fontSize: '20px' }}>Mi Perfil</h2>
                            <span style={{ color: '#00A8CC', fontSize: '12px', fontWeight: 'bold' }}>Credenciales NovaSalud</span>
                        </div>
                    </div>

                    <label style={labelStyle}>Médico Titular</label>
                    <input type="text" value={`Dr(a). ${doctor.nombreCompleto}`} readOnly style={inputDisabledStyle} />

                    <label style={labelStyle}>Especialidad</label>
                    <input type="text" value={doctor.especialidad} readOnly style={inputDisabledStyle} />

                    <label style={labelStyle}>Documento (DNI)</label>
                    <input type="text" value={doctor.dni} readOnly style={inputDisabledStyle} />

                    <label style={labelStyle}>Correo Institucional</label>
                    <input type="text" value={doctor.correo} readOnly style={inputDisabledStyle} />

                    <button onClick={() => navigate('/dashboard')} style={{ width: '100%', padding: '12px', background: 'transparent', color: '#ffffff', border: '1px solid rgba(255,255,255,0.4)', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', marginTop: '10px', transition: '0.3s' }}>
                        ← Volver al Dashboard
                    </button>
                </div>

                {/* COLUMNA DERECHA: CAMBIAR CONTRASEÑA */}
                <div style={{ background: 'rgba(0, 0, 0, 0.2)', padding: '25px', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <h3 style={{ color: '#ffffff', marginTop: 0, marginBottom: '20px', fontSize: '16px', borderBottom: '1px solid rgba(255,255,255,0.2)', paddingBottom: '10px' }}>🔐 Seguridad de Cuenta</h3>
                    
                    <form onSubmit={actualizarPassword}>
                        <label style={labelStyle}>Contraseña Actual</label>
                        <input 
                            type="password" 
                            name="actual" 
                            value={passwords.actual} 
                            onChange={handlePasswordChange} 
                            required 
                            style={inputStyle} 
                            disabled={isLoading}
                        />

                        <label style={labelStyle}>Nueva Contraseña</label>
                        <div style={{ position: 'relative' }}>
                            <input 
                                type={mostrarPassword ? "text" : "password"} 
                                name="nueva" 
                                value={passwords.nueva} 
                                onChange={handlePasswordChange} 
                                required 
                                style={inputStyle} 
                                disabled={isLoading}
                            />
                            <button type="button" onClick={() => setMostrarPassword(!mostrarPassword)} disabled={isLoading} style={{ position: 'absolute', right: '12px', top: '14px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', color: 'white' }}>
                                {mostrarPassword ? "🙈" : "👁️"}
                            </button>
                        </div>

                        <label style={labelStyle}>Confirmar Nueva Contraseña</label>
                        <input 
                            type={mostrarPassword ? "text" : "password"} 
                            name="confirmar" 
                            value={passwords.confirmar} 
                            onChange={handlePasswordChange} 
                            required 
                            style={inputStyle} 
                            disabled={isLoading}
                        />

                        <button type="submit" disabled={isLoading} style={{ width: '100%', padding: '14px', background: isLoading ? 'rgba(255,255,255,0.3)' : '#00A8CC', color: '#ffffff', border: 'none', borderRadius: '8px', cursor: isLoading ? 'wait' : 'pointer', fontWeight: 'bold', marginTop: '10px', boxShadow: isLoading ? 'none' : '0 4px 15px rgba(0, 168, 204, 0.4)', transition: '0.3s' }}>
                            {isLoading ? '⏳ ACTUALIZANDO...' : 'GUARDAR CAMBIOS'}
                        </button>
                    </form>

                    <div style={{ textAlign: 'center', marginTop: '25px' }}>
                        <button onClick={cerrarSesion} style={{ background: 'none', border: 'none', color: '#fc8181', textDecoration: 'underline', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}>
                            Cerrar Sesión Segura
                        </button>
                    </div>
                </div>
            </div>
            <style>{` input::placeholder { color: rgba(255,255,255,0.5); } `}</style>
        </div>
    );
};

export default PerfilDoctor;    