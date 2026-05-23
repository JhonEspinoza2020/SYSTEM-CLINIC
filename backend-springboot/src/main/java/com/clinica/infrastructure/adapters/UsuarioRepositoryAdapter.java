package com.clinica.infrastructure.adapters;

import com.clinica.domain.entities.Usuario;
import com.clinica.domain.ports.UsuarioRepositoryPort;
import com.clinica.infrastructure.output.entities.UsuarioJpaEntity;
import com.clinica.infrastructure.output.repositories.UsuarioCrudRepository;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
public class UsuarioRepositoryAdapter implements UsuarioRepositoryPort {

    private final UsuarioCrudRepository crudRepository;

    public UsuarioRepositoryAdapter(UsuarioCrudRepository crudRepository) {
        this.crudRepository = crudRepository;
    }

    @Override
    public Usuario guardar(Usuario usuario) {
        return mapToDomain(crudRepository.save(mapToEntity(usuario)));
    }

    @Override
    public Optional<Usuario> buscarPorCorreo(String correo) {
        return crudRepository.findByCorreo(correo).map(this::mapToDomain);
    }

    @Override
    public Optional<Usuario> buscarPorId(String id) {
        return crudRepository.findById(id).map(this::mapToDomain);
    }

    @Override
    public List<Usuario> listarTodos() {
        return crudRepository.findAll().stream().map(this::mapToDomain).collect(Collectors.toList());
    }

    @Override
    public void eliminar(String id) {
        crudRepository.deleteById(id);
    }

    @Override
    public boolean existePorId(String id) {
        return crudRepository.existsById(id);
    }

    private UsuarioJpaEntity mapToEntity(Usuario u) {
        return UsuarioJpaEntity.builder()
                .id(u.getId())
                .username(u.getUsername())
                .password(u.getPassword())
                .nombreCompleto(u.getNombreCompleto())
                .correo(u.getCorreo())
                .especialidad(u.getEspecialidad())
                .dniDoctor(u.getDniDoctor())
                .rol(u.getRol())
                .estado(u.getEstado())
                .firmaDigital(u.getFirmaDigital())
                .build();
    }

    private Usuario mapToDomain(UsuarioJpaEntity e) {
        return Usuario.builder()
                .id(e.getId())
                .username(e.getUsername())
                .password(e.getPassword())
                .nombreCompleto(e.getNombreCompleto())
                .correo(e.getCorreo())
                .especialidad(e.getEspecialidad())
                .dniDoctor(e.getDniDoctor())
                .rol(e.getRol())
                .estado(e.getEstado())
                .firmaDigital(e.getFirmaDigital())
                .build();
    }
}
