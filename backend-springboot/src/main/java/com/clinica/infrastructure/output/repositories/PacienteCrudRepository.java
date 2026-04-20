package com.clinica.infrastructure.output.repositories;

import com.clinica.infrastructure.output.entities.PacienteJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface PacienteCrudRepository extends JpaRepository<PacienteJpaEntity, String> {
    Optional<PacienteJpaEntity> findByDni(String dni);
}