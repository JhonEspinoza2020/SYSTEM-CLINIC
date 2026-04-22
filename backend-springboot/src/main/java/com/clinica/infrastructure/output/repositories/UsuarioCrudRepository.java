package com.clinica.infrastructure.output.repositories;

import com.clinica.infrastructure.output.entities.UsuarioJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UsuarioCrudRepository extends JpaRepository<UsuarioJpaEntity, String> {
    Optional<UsuarioJpaEntity> findByUsername(String username);
    
    // Añadimos esta nueva línea para buscar por el correo del Login
    Optional<UsuarioJpaEntity> findByCorreo(String correo);
}