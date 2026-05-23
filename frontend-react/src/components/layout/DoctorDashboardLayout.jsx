import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { clearSession, getSession } from '../../hooks/useAuth';
import { Icon } from '../icons/Icons';
import { theme } from '../../styles/dashboardTheme';

const navItems = [
    { to: '/dashboard/citas', label: 'Citas activas', icon: 'bell', end: false },
    { to: '/dashboard/registrar', label: 'Registrar paciente', icon: 'clipboard', end: false },
    { to: '/dashboard/pacientes', label: 'Pacientes y análisis IA', icon: 'brain', end: false },
    { to: '/dashboard/perfil', label: 'Mi perfil', icon: 'doctor', end: false },
];

const DoctorDashboardLayout = () => {
    const navigate = useNavigate();
    const doctor = getSession() || {};

    const cerrarSesion = () => {
        clearSession();
        navigate('/');
    };

    return (
        <div style={{ ...theme.pageBackground, minHeight: '100vh', display: 'flex' }}>
            <aside
                style={{
                    width: '260px',
                    flexShrink: 0,
                    background: 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)',
                    color: '#fff',
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '24px 0',
                    boxShadow: '4px 0 24px rgba(15, 23, 42, 0.15)',
                }}
            >
                <div style={{ padding: '0 22px 28px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                    <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '1.2px', color: '#94a3b8', textTransform: 'uppercase' }}>
                        NovaSalud
                    </div>
                    <div style={{ fontSize: '18px', fontWeight: 800, marginTop: '6px' }}>Panel médico</div>
                    <div style={{ fontSize: '13px', color: '#cbd5e1', marginTop: '8px', lineHeight: 1.4 }}>
                        {doctor.nombreCompleto || 'Doctor'}
                    </div>
                    {doctor.especialidad && (
                        <div style={{ fontSize: '11px', color: theme.accent, marginTop: '6px', fontWeight: 600 }}>
                            {doctor.especialidad}
                        </div>
                    )}
                </div>

                <nav style={{ flex: 1, padding: '20px 12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {navItems.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            style={({ isActive }) => ({
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                padding: '12px 16px',
                                borderRadius: '10px',
                                textDecoration: 'none',
                                fontSize: '14px',
                                fontWeight: isActive ? 700 : 500,
                                color: isActive ? '#fff' : '#cbd5e1',
                                background: isActive ? 'rgba(0, 168, 204, 0.25)' : 'transparent',
                                borderLeft: isActive ? `4px solid ${theme.accent}` : '4px solid transparent',
                                transition: '0.2s',
                            })}
                        >
                            <Icon name={item.icon} size={18} color="currentColor" />
                            {item.label}
                        </NavLink>
                    ))}
                </nav>

                <div style={{ padding: '12px 16px 0', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                    <button
                        type="button"
                        onClick={cerrarSesion}
                        style={{
                            width: '100%',
                            padding: '12px',
                            background: 'rgba(239, 68, 68, 0.15)',
                            color: '#fecaca',
                            border: '1px solid rgba(239, 68, 68, 0.35)',
                            borderRadius: '10px',
                            fontWeight: 700,
                            cursor: 'pointer',
                            fontSize: '13px',
                        }}
                    >
                        Cerrar sesión
                    </button>
                </div>
            </aside>

            <main style={{ flex: 1, padding: '28px 32px', overflow: 'auto', minWidth: 0 }}>
                <Outlet />
            </main>
        </div>
    );
};

export default DoctorDashboardLayout;
