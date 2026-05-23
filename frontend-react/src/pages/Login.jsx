import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AuthService from '../services/AuthService';
import { saveSession, clearSession } from '../hooks/useAuth';
import { LoginForm, DoctorSpecialtyPicker, PasswordRecovery } from '../components/login/LoginViews';
import Swal from 'sweetalert2';

const Login = () => {
    const [credentials, setCredentials] = useState({ correo: '', password: '' });
    const [error, setError] = useState('');
    const [correoError, setCorreoError] = useState('');
    const [mostrarPassword, setMostrarPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const [loginFormKey, setLoginFormKey] = useState(0);
    const [vista, setVista] = useState('login');
    const [datosRecuperacion, setDatosRecuperacion] = useState({ correo: '', codigo: '', nueva: '', confirmar: '' });
    const [doctorTemp, setDoctorTemp] = useState(null);
    const [especialidadSeleccionada, setEspecialidadSeleccionada] = useState('');

    useEffect(() => { clearSession(); }, []);

    useEffect(() => {
        if (location.state?.fromRegistro) {
            setCredentials({ correo: '', password: '' });
            setLoginFormKey((k) => k + 1);
            setError('');
            window.history.replaceState({}, document.title);
        }
    }, [location.state]);

    const validarCorreo = (correo) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (correo && !regex.test(correo)) setCorreoError('Formato de correo inválido');
        else setCorreoError('');
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'password' && /[<>"';]/g.test(value)) return;
        setCredentials({ ...credentials, [name]: value });
        if (name === 'correo') validarCorreo(value);
    };

    const iniciarSesion = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            const respuesta = await AuthService.login(credentials);
            const { token, usuario } = respuesta.data;
            setIsLoading(false);
            if (usuario.rol === 'DOCTOR') {
                localStorage.setItem('authToken', token);
                setDoctorTemp(usuario);
                const especialidadesArray = usuario.especialidad ? usuario.especialidad.split(',').map(es => es.trim()) : ['Medicina General'];
                setEspecialidadSeleccionada(especialidadesArray[0]);
                setVista('seleccionar-especialidad');
            } else {
                saveSession(token, usuario);
                Swal.fire({ title: '¡Acceso Autorizado!', text: `Bienvenido(a), ${usuario.nombreCompleto.split(' ')[0]}`, icon: 'success', timer: 1500, showConfirmButton: false })
                    .then(() => {
                        if (usuario.rol === 'ADMIN') navigate('/dashboard-admin');
                        else if (usuario.rol === 'PACIENTE') navigate('/dashboard-paciente');
                        else navigate('/dashboard/citas');
                    });
            }
        } catch (err) {
            setIsLoading(false);
            if (err.response?.status === 403) setError(err.response.data.error || 'Cuenta inactiva.');
            else if (err.response?.status === 404) setError('Usuario no registrado en el sistema.');
            else if (err.response?.status === 401) setError('Contraseña incorrecta.');
            else setError('Credenciales inválidas.');
        }
    };

    const confirmarEspecialidad = (e) => {
        e.preventDefault();
        const usuarioFinal = { ...doctorTemp, especialidad: especialidadSeleccionada };
        localStorage.setItem('usuarioLogueado', JSON.stringify(usuarioFinal));
        Swal.fire({ title: 'Turno Iniciado', text: `Atendiendo como: ${especialidadSeleccionada}`, icon: 'success', timer: 1500, showConfirmButton: false })
            .then(() => navigate('/dashboard/citas'));
    };

    const handleRecuperacionChange = (e) => setDatosRecuperacion({ ...datosRecuperacion, [e.target.name]: e.target.value });

    const solicitarCodigo = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await AuthService.solicitarRecuperacion(datosRecuperacion.correo);
            setIsLoading(false);
            Swal.fire('¡Correo Enviado!', 'Revisa tu bandeja para el código de 6 dígitos.', 'success');
            setVista('ingresar-codigo');
        } catch { setIsLoading(false); Swal.fire('Error', 'El correo ingresado no existe.', 'error'); }
    };

    const verificarCodigo = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await AuthService.verificarCodigo(datosRecuperacion.correo, datosRecuperacion.codigo);
            setIsLoading(false);
            setVista('nueva-password');
        } catch { setIsLoading(false); Swal.fire('Código Inválido', 'Incorrecto o expirado.', 'error'); }
    };

    const guardarNuevaPassword = async (e) => {
        e.preventDefault();
        if (datosRecuperacion.nueva !== datosRecuperacion.confirmar) return Swal.fire('Error', 'Las contraseñas no coinciden.', 'error');
        setIsLoading(true);
        try {
            await AuthService.nuevaPassword(datosRecuperacion.correo, datosRecuperacion.nueva);
            setIsLoading(false);
            Swal.fire('¡Éxito!', 'Contraseña restablecida. Ya puedes iniciar sesión.', 'success');
            setVista('login');
            setDatosRecuperacion({ correo: '', codigo: '', nueva: '', confirmar: '' });
        } catch { setIsLoading(false); Swal.fire('Error', 'No se pudo actualizar la contraseña.', 'error'); }
    };

    const tituloVista = vista === 'login' ? 'ACCESO UNIVERSAL' : vista === 'seleccionar-especialidad' ? 'TURNO MÉDICO' : 'RECUPERACIÓN DE ACCESO';

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
            <video autoPlay loop muted playsInline style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: -2 }}>
                <source src="/NovaSalud.mp4" type="video/mp4" />
            </video>
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(10, 20, 30, 0.45)', zIndex: -1 }} />
            <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '400px', padding: '40px 30px', borderRadius: '20px', backgroundColor: 'rgba(255, 255, 255, 0.10)', boxShadow: '0 20px 40px rgba(0,0,0,0.5)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.2)' }}>
                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                    <h2 style={{ color: '#ffffff', marginTop: '15px', marginBottom: '5px', fontSize: '32px', fontWeight: '800' }}>
                        <span style={{ color: '#00A8CC' }}>Nova</span>Salud
                    </h2>
                    <p style={{ color: '#cfd8dc', margin: 0, fontSize: '14px', fontWeight: 'bold', letterSpacing: '1px' }}>{tituloVista}</p>
                </div>
                {error && vista === 'login' && (
                    <div style={{ backgroundColor: 'rgba(229, 57, 53, 0.8)', color: '#ffffff', padding: '12px', marginBottom: '20px', borderRadius: '8px', textAlign: 'center', fontWeight: 'bold', fontSize: '13px' }}>{error}</div>
                )}
                {vista === 'login' && (
                    <>
                        {location.state?.fromRegistro && (
                            <div style={{ backgroundColor: 'rgba(56, 161, 105, 0.25)', color: '#d1fae5', padding: '12px', marginBottom: '16px', borderRadius: '8px', textAlign: 'center', fontSize: '13px', fontWeight: 600 }}>
                                Cuenta creada. Ingrese sus credenciales manualmente.
                            </div>
                        )}
                        <LoginForm
                            correoError={correoError}
                            mostrarPassword={mostrarPassword}
                            isLoading={isLoading}
                            credentials={credentials}
                            formKey={loginFormKey}
                            onChange={handleChange}
                            onTogglePassword={() => setMostrarPassword(!mostrarPassword)}
                            onSubmit={iniciarSesion}
                            onForgotPassword={() => { setVista('pedir-correo'); setError(''); }}
                        />
                    </>
                )}
                {vista === 'seleccionar-especialidad' && (
                    <DoctorSpecialtyPicker doctorTemp={doctorTemp} especialidadSeleccionada={especialidadSeleccionada} setEspecialidadSeleccionada={setEspecialidadSeleccionada} onSubmit={confirmarEspecialidad} />
                )}
                {(vista === 'pedir-correo' || vista === 'ingresar-codigo' || vista === 'nueva-password') && (
                    <PasswordRecovery vista={vista} datosRecuperacion={datosRecuperacion} isLoading={isLoading} onChange={handleRecuperacionChange} onSolicitarCodigo={solicitarCodigo} onVerificarCodigo={verificarCodigo} onGuardarPassword={guardarNuevaPassword} onCancelar={() => setVista('login')} />
                )}
            </div>
            <style>{`input::placeholder { color: rgba(255,255,255,0.6); } @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }`}</style>
        </div>
    );
};

export default Login;
