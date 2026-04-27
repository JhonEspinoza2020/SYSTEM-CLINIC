import React from 'react';
import { Link } from 'react-router-dom';

const Registro = () => {
    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: '#0f172a', padding: '20px', fontFamily: 'system-ui, sans-serif' }}>
            
            {/* ANIMACIONES ESPECÍFICAS PARA ESTA PANTALLA */}
            <style>{`
                @keyframes zoomIn {
                    0% { opacity: 0; transform: scale(0.9); }
                    100% { opacity: 1; transform: scale(1); }
                }
                .animacion-zoom {
                    animation: zoomIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
                .tarjeta-hover {
                    transition: all 0.3s ease;
                }
                .tarjeta-hover:hover {
                    transform: translateY(-8px);
                    background: rgba(255, 255, 255, 0.08) !important;
                }
            `}</style>

            <div className="animacion-zoom" style={{ width: '100%', maxWidth: '750px', background: 'rgba(255,255,255,0.03)', padding: '50px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)', backdropFilter: 'blur(12px)', textAlign: 'center' }}>
                
                {/* CABECERA */}
                <div style={{ marginBottom: '40px' }}>
                    <svg width="60" height="60" viewBox="0 0 100 100" fill="none" style={{ margin: '0 auto 15px auto' }}>
                        <circle cx="50" cy="50" r="45" stroke="#00A8CC" strokeWidth="6"/>
                        <path d="M30 72 V28 L70 72 V28" stroke="#2ecc71" strokeWidth="9" strokeLinecap="square" strokeLinejoin="miter"/>
                    </svg>
                    <h2 style={{ color: 'white', margin: 0, fontSize: '32px', fontWeight: '800', letterSpacing: '0.5px' }}>
                        Únete a <span style={{ color: '#00A8CC' }}>Nova</span>Salud
                    </h2>
                    <p style={{ color: '#94a3b8', fontSize: '15px', marginTop: '10px' }}>Selecciona tu perfil para comenzar el proceso de registro</p>
                </div>

                {/* TARJETAS DE SELECCIÓN */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '25px' }}>
                    
                    {/* TARJETA PACIENTE */}
                    <Link to="/registro-paciente" className="tarjeta-hover" style={{ textDecoration: 'none', background: 'rgba(15, 23, 42, 0.6)', borderRadius: '16px', padding: '35px 20px', border: '1px solid rgba(0, 168, 204, 0.3)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div style={{ background: 'rgba(0, 168, 204, 0.1)', padding: '20px', borderRadius: '50%', marginBottom: '20px' }}>
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#00A8CC" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                <circle cx="12" cy="7" r="4"></circle>
                            </svg>
                        </div>
                        <h3 style={{ color: 'white', margin: '0 0 10px 0', fontSize: '20px' }}>Soy Paciente</h3>
                        <p style={{ color: '#94a3b8', margin: 0, fontSize: '13px', lineHeight: '1.5' }}>Accede a tu historial médico, solicita citas y revisa tus diagnósticos.</p>
                        <div style={{ marginTop: '20px', color: '#00A8CC', fontWeight: 'bold', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px' }}>Crear Cuenta →</div>
                    </Link>

                    {/* TARJETA DOCTOR */}
                    <Link to="/registro-doctor" className="tarjeta-hover" style={{ textDecoration: 'none', background: 'rgba(15, 23, 42, 0.6)', borderRadius: '16px', padding: '35px 20px', border: '1px solid rgba(46, 204, 113, 0.3)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div style={{ background: 'rgba(46, 204, 113, 0.1)', padding: '20px', borderRadius: '50%', marginBottom: '20px' }}>
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#2ecc71" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                            </svg>
                        </div>
                        <h3 style={{ color: 'white', margin: '0 0 10px 0', fontSize: '20px' }}>Soy Personal Médico</h3>
                        <p style={{ color: '#94a3b8', margin: 0, fontSize: '13px', lineHeight: '1.5' }}>Gestiona tus consultas, visualiza historiales y atiende a tus pacientes.</p>
                        <div style={{ marginTop: '20px', color: '#2ecc71', fontWeight: 'bold', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px' }}>Solicitar Ingreso →</div>
                    </Link>

                </div>

                {/* ENLACE DE RETORNO */}
                <div style={{ marginTop: '40px' }}>
                    <Link to="/" style={{ color: '#cbd5e1', textDecoration: 'none', fontSize: '14px', fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '8px', transition: '0.3s' }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                        Ya tengo una cuenta. Iniciar Sesión
                    </Link>
                </div>

            </div>
        </div>
    );
};

export default Registro;