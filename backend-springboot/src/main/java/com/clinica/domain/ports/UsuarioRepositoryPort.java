package com.clinica.domain.ports;

import com.clinica.domain.entities.Usuario;

import java.util.List;
import java.util.Optional;

public interface UsuarioRepositoryPort {
    Usuario guardar(Usuario usuario);
    Optional<Usuario> buscarPorCorreo(String correo);
    Optional<Usuario> buscarPorId(String id);
    List<Usuario> listarTodos();
    void eliminar(String id);
    boolean existePorId(String id);
}
