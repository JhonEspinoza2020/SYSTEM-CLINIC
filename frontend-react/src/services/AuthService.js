import apiClient from '../api/client';

const AuthService = {
    login(credentials) {
        return apiClient.post('/api/auth/login', credentials);
    },
    registro(usuario) {
        return apiClient.post('/api/auth/registro', usuario);
    },
    solicitarRecuperacion(correo) {
        return apiClient.post(`/api/auth/recuperar?correo=${encodeURIComponent(correo)}`);
    },
    verificarCodigo(correo, codigo) {
        return apiClient.post('/api/auth/verificar-codigo', { correo, codigo });
    },
    cambiarPassword(correo, passwordActual, passwordNueva) {
        return apiClient.put('/api/auth/cambiar-password', { correo, passwordActual, passwordNueva });
    },
    nuevaPassword(correo, password) {
        return apiClient.put('/api/auth/nueva-password', { correo, password });
    },
    listarDoctoresActivos() {
        return apiClient.get('/api/auth/doctores-activos');
    },
    listarUsuarios() {
        return apiClient.get('/api/auth/usuarios');
    },
    cambiarEstado(id, estado) {
        return apiClient.put(`/api/auth/usuarios/${id}/estado`, { estado });
    },
    eliminarUsuario(id) {
        return apiClient.delete(`/api/auth/usuarios/${id}`);
    },
};

export default AuthService;
