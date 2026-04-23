package com.clinica.infrastructure.output.repositories;

import com.clinica.infrastructure.output.entities.PacienteJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PacienteCrudRepository extends JpaRepository<PacienteJpaEntity, String> {
    
    // El DNI se queda con Optional porque un DNI le pertenece a UNA sola persona
    Optional<PacienteJpaEntity> findByDni(String dni);
    
    // ¡AQUÍ ESTÁ LA CORRECCIÓN! Cambiamos a List porque un doctor tiene MUCHOS pacientes
    List<PacienteJpaEntity> findByIdDoctor(String idDoctor);
}