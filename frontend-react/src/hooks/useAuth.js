export const getSession = () => {
    try {
        return JSON.parse(localStorage.getItem('usuarioLogueado') || 'null');
    } catch {
        return null;
    }
};

export const saveSession = (token, usuario) => {
    localStorage.setItem('authToken', token);
    localStorage.setItem('usuarioLogueado', JSON.stringify(usuario));
};

export const clearSession = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('usuarioLogueado');
    localStorage.removeItem('doctorLogueado');
};

export const hasRole = (rol) => {
    const user = getSession();
    return user?.rol === rol;
};
