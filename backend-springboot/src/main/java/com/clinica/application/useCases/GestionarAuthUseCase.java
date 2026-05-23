package com.clinica.application.useCases;

import com.clinica.domain.entities.Usuario;

import java.util.List;
import java.util.Map;

public interface GestionarAuthUseCase {
    Map<String, Object> iniciarSesion(String correo, String password);
    Usuario registrarUsuario(Usuario nuevoUsuario);
    void solicitarCodigoRecuperacion(String correo);
    void verificarCodigo(String correo, String codigo);
    void actualizarPassword(String correo, String nuevaPassword);
    void cambiarPasswordAutenticado(String correo, String passwordActual, String nuevaPassword);
    List<Usuario> listarDoctoresActivos();
    List<Usuario> listarTodosUsuarios();
    Usuario cambiarEstadoUsuario(String id, String estado);
    void eliminarUsuario(String id);
}
