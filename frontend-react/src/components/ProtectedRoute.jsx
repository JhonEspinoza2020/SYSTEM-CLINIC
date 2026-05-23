import React from 'react';
import { Navigate } from 'react-router-dom';
import { getSession } from '../hooks/useAuth';

const ProtectedRoute = ({ children, roles = [] }) => {
    const usuario = getSession();
    const token = localStorage.getItem('authToken');

    if (!usuario || !token) {
        return <Navigate to="/" replace />;
    }

    if (roles.length > 0 && !roles.includes(usuario.rol)) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
