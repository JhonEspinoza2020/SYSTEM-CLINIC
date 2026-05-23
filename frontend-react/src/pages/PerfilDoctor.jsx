import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../services/AuthService';
import { Icon } from '../components/icons/Icons';
import Swal from 'sweetalert2';
import { theme } from '../styles/dashboardTheme';

const PerfilDoctor = () => {
    const [doctor, setDoctor] = useState({ nombreCompleto: '', dni: '', correo: '', especialidad: '', id: '' });
    const [passwords, setPasswords] = useState({ actual: '', nueva: '', confirmar: '' });
    const [mostrarPassword, setMostrarPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const doctorGuardado = localStorage.getItem('usuarioLogueado');
        if (doctorGuardado) {
            const data = JSON.parse(doctorGuardado);
            setDoctor({
                id: data.id,
                nombreCompleto: data.nombreCompleto || data.nombre,
                dni: data.dniDoctor || data.dni,
                correo: data.correo,
                especialidad: data.especialidad,
            });
        } else {
            navigate('/');
        }
    }, [navigate]);

    const handlePasswordChange = (e) => {
        setPasswords({ ...passwords, [e.target.name]: e.target.value });
    };

    const actualizarPassword = async (e) => {
        e.preventDefault();
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
            await AuthService.cambiarPassword(doctor.correo, passwords.actual, passwords.nueva);
            Swal.fire({ title: '¡Seguridad Actualizada!', text: 'Tu contraseña ha sido cambiada con éxito.', icon: 'success', confirmButtonColor: '#1A365D' });
            setPasswords({ actual: '', nueva: '', confirmar: '' });
        } catch {
            Swal.fire('Error', 'La contraseña actual es incorrecta o hubo un problema de conexión.', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const labelStyle = { fontWeight: 700, color: '#475569', fontSize: '12px', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' };
    const inputDisabledStyle = { width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '8px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc', color: '#64748b', outline: 'none', fontSize: '14px', cursor: 'not-allowed', boxSizing: 'border-box' };
    const inputStyle = { width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: '#fff', color: '#1e293b', outline: 'none', fontSize: '14px', boxSizing: 'border-box' };

    return (
        <div style={{ ...theme.card, padding: '32px', maxWidth: '960px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '25px' }}>
                        <div style={{ background: '#1A365D', padding: '10px', borderRadius: '12px', marginRight: '15px' }}>
                            <svg width="30" height="30" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect width="100" height="100" rx="18" fill="#FFFFFF" />
                                <path d="M28 72 V28 L72 72 V28" stroke="#00A8CC" strokeWidth="12" strokeLinecap="square" strokeLinejoin="miter" />
                            </svg>
                        </div>
                        <div>
                            <h2 style={{ color: theme.navy, margin: 0, fontSize: '20px' }}>Mi Perfil</h2>
                            <span style={{ color: theme.accent, fontSize: '12px', fontWeight: 'bold' }}>Credenciales NovaSalud</span>
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
                </div>
                <div style={{ background: '#f8fafc', padding: '25px', borderRadius: '15px', border: '1px solid #e2e8f0' }}>
                    <h3 style={{ color: theme.navy, marginTop: 0, marginBottom: '20px', fontSize: '16px', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Icon name="shield" size={16} color={theme.accent} /> Seguridad de Cuenta
                    </h3>
                    <form onSubmit={actualizarPassword}>
                        <label style={labelStyle}>Contraseña Actual</label>
                        <input type="password" name="actual" value={passwords.actual} onChange={handlePasswordChange} required style={inputStyle} disabled={isLoading} />
                        <label style={labelStyle}>Nueva Contraseña</label>
                        <div style={{ position: 'relative' }}>
                            <input type={mostrarPassword ? 'text' : 'password'} name="nueva" value={passwords.nueva} onChange={handlePasswordChange} required style={inputStyle} disabled={isLoading} />
                            <button type="button" onClick={() => setMostrarPassword(!mostrarPassword)} disabled={isLoading} style={{ position: 'absolute', right: '12px', top: '14px', background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}>
                                <Icon name={mostrarPassword ? 'eye-off' : 'eye'} size={16} color="#64748b" />
                            </button>
                        </div>
                        <label style={labelStyle}>Confirmar Nueva Contraseña</label>
                        <input type={mostrarPassword ? 'text' : 'password'} name="confirmar" value={passwords.confirmar} onChange={handlePasswordChange} required style={inputStyle} disabled={isLoading} />
                        <button type="submit" disabled={isLoading} style={{ width: '100%', padding: '14px', background: isLoading ? '#94a3b8' : theme.accent, color: '#fff', border: 'none', borderRadius: '8px', cursor: isLoading ? 'wait' : 'pointer', fontWeight: 'bold', marginTop: '10px' }}>
                            {isLoading ? 'ACTUALIZANDO...' : 'GUARDAR CAMBIOS'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default PerfilDoctor;
