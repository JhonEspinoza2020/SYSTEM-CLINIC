import React from 'react';
import { Link } from 'react-router-dom';
import { labelStyle, inputStyle, btnSubmitStyle, btnCancelStyle } from './loginStyles';
import { Icon } from '../icons/Icons';

export const LoginForm = ({
    correoError,
    mostrarPassword,
    isLoading,
    credentials,
    formKey,
    onChange,
    onTogglePassword,
    onSubmit,
    onForgotPassword,
}) => (
    <form key={formKey} onSubmit={onSubmit} autoComplete="off" style={{ animation: 'fadeIn 0.5s' }}>
        <input type="text" name="fakeuser" autoComplete="username" style={{ display: 'none' }} tabIndex={-1} aria-hidden="true" readOnly />
        <input type="password" name="fakepass" autoComplete="new-password" style={{ display: 'none' }} tabIndex={-1} aria-hidden="true" readOnly />
        <label style={labelStyle}>Correo Electrónico:</label>
        <input
            type="email"
            name="correo"
            data-cy="login-correo"
            value={credentials.correo}
            onChange={onChange}
            autoComplete="off"
            required
            style={inputStyle(correoError)}
            placeholder="ejemplo@correo.com"
            disabled={isLoading}
        />
        <label style={labelStyle}>Contraseña:</label>
        <div style={{ position: 'relative', width: '100%', marginBottom: '15px' }}>
            <input
                type={mostrarPassword ? 'text' : 'password'}
                name="password"
                data-cy="login-password"
                value={credentials.password}
                onChange={onChange}
                autoComplete="off"
                readOnly
                onFocus={(e) => e.target.removeAttribute('readOnly')}
                required
                style={{ ...inputStyle(false), marginBottom: 0 }}
                disabled={isLoading}
            />
            <button type="button" onClick={onTogglePassword} disabled={isLoading} title={mostrarPassword ? 'Ocultar' : 'Mostrar'} style={{ position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#ffffff', display: 'flex', alignItems: 'center' }}>
                <Icon name={mostrarPassword ? 'eye-off' : 'eye'} size={18} color="#ffffff" />
            </button>
        </div>
        <button type="submit" data-cy="login-submit" disabled={!!correoError || isLoading} style={btnSubmitStyle(!!correoError || isLoading)}>
            {isLoading ? 'VALIDANDO CREDENCIALES...' : 'INGRESAR AL SISTEMA'}
        </button>
        <div style={{ textAlign: 'center', marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button type="button" onClick={onForgotPassword} style={{ background: 'none', border: 'none', color: '#cbd5e1', cursor: 'pointer', fontSize: '13px', textDecoration: 'underline' }}>¿Olvidaste tu contraseña?</button>
            <Link to="/registro" style={{ color: '#00A8CC', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px' }}>¿No tienes cuenta? Regístrate aquí</Link>
        </div>
    </form>
);

export const DoctorSpecialtyPicker = ({ doctorTemp, especialidadSeleccionada, setEspecialidadSeleccionada, onSubmit }) => (
    <form onSubmit={onSubmit} style={{ animation: 'fadeIn 0.5s', textAlign: 'center' }}>
        <h3 style={{ color: 'white', marginTop: 0, marginBottom: '15px' }}>Dr(a). {doctorTemp?.nombreCompleto.split(' ')[0]}</h3>
        <p style={{ color: '#cbd5e1', fontSize: '13px', marginBottom: '20px' }}>Seleccione el área de consulta para su turno actual.</p>
        <div style={{ textAlign: 'left', marginBottom: '20px' }}>
            <label style={labelStyle}>Especialidad Activa:</label>
            <select data-cy="doctor-especialidad" value={especialidadSeleccionada} onChange={(e) => setEspecialidadSeleccionada(e.target.value)} required style={{ ...inputStyle(false), backgroundColor: 'rgba(255, 255, 255, 0.9)', color: '#333', cursor: 'pointer' }}>
                {doctorTemp?.especialidad ? doctorTemp.especialidad.split(',').map((esp, index) => (
                    <option key={index} value={esp.trim()}>{esp.trim()}</option>
                )) : <option value="Medicina General">Medicina General</option>}
            </select>
        </div>
        <button type="submit" data-cy="doctor-confirmar-especialidad" style={btnSubmitStyle(false)}>CONFIRMAR E INGRESAR</button>
    </form>
);

export const PasswordRecovery = ({ vista, datosRecuperacion, isLoading, onChange, onSolicitarCodigo, onVerificarCodigo, onGuardarPassword, onCancelar }) => {
    if (vista === 'pedir-correo') {
        return (
            <form onSubmit={onSolicitarCodigo} style={{ animation: 'fadeIn 0.5s' }}>
                <p style={{ color: '#e2e8f0', fontSize: '13px', marginBottom: '20px', textAlign: 'center' }}>Ingresa tu correo. Te enviaremos un código de 6 dígitos.</p>
                <label style={labelStyle}>Ingresar Correo:</label>
                <input type="email" name="correo" value={datosRecuperacion.correo} onChange={onChange} required style={inputStyle(false)} placeholder="tu-correo@novasalud.com" disabled={isLoading} />
                <button type="submit" disabled={isLoading} style={btnSubmitStyle(isLoading)}>{isLoading ? 'ENVIANDO...' : 'ENVIAR CÓDIGO SEGURO'}</button>
                <button type="button" onClick={onCancelar} style={btnCancelStyle}>Cancelar y Volver</button>
            </form>
        );
    }
    if (vista === 'ingresar-codigo') {
        return (
            <form onSubmit={onVerificarCodigo} style={{ animation: 'fadeIn 0.5s' }}>
                <div style={{ backgroundColor: 'rgba(56, 161, 105, 0.2)', border: '1px solid #38a169', padding: '10px', borderRadius: '8px', marginBottom: '20px', textAlign: 'center' }}>
                    <span style={{ color: '#9ae6b4', fontSize: '12px', fontWeight: 'bold' }}>Código enviado a: {datosRecuperacion.correo}</span>
                </div>
                <label style={labelStyle}>Código de Verificación (6 dígitos):</label>
                <input type="text" name="codigo" value={datosRecuperacion.codigo} onChange={onChange} required maxLength="6" style={{ ...inputStyle(false), textAlign: 'center', fontSize: '20px', letterSpacing: '5px', fontWeight: 'bold' }} placeholder="------" disabled={isLoading} />
                <button type="submit" disabled={datosRecuperacion.codigo.length !== 6 || isLoading} style={btnSubmitStyle(datosRecuperacion.codigo.length !== 6 || isLoading)}>{isLoading ? 'VERIFICANDO...' : 'VALIDAR CÓDIGO'}</button>
                <button type="button" onClick={onCancelar} style={btnCancelStyle}>Cancelar y Volver</button>
            </form>
        );
    }
    if (vista === 'nueva-password') {
        return (
            <form onSubmit={onGuardarPassword} style={{ animation: 'fadeIn 0.5s' }}>
                <label style={labelStyle}>Nueva Contraseña:</label>
                <input type="password" name="nueva" value={datosRecuperacion.nueva} onChange={onChange} required minLength="6" style={inputStyle(false)} placeholder="Mínimo 6 caracteres" disabled={isLoading} autoComplete="new-password" />
                <label style={labelStyle}>Confirmar Contraseña:</label>
                <input type="password" name="confirmar" value={datosRecuperacion.confirmar} onChange={onChange} required style={inputStyle(datosRecuperacion.nueva !== datosRecuperacion.confirmar && datosRecuperacion.confirmar.length > 0)} placeholder="Repite la contraseña" disabled={isLoading} autoComplete="new-password" />
                <button type="submit" disabled={isLoading} style={btnSubmitStyle(isLoading)}>{isLoading ? 'GUARDANDO...' : 'GUARDAR NUEVO ACCESO'}</button>
            </form>
        );
    }
    return null;
};
