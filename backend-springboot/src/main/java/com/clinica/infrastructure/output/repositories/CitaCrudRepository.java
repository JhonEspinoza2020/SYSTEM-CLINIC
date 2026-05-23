package com.clinica.infrastructure.output.repositories;

import com.clinica.infrastructure.output.entities.CitaJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CitaCrudRepository extends JpaRepository<CitaJpaEntity, String> {
    
    // Encuentra todas las citas que le pertenecen a un paciente
    List<CitaJpaEntity> findByPacienteId(String pacienteId);
    
    // Encuentra todas las citas asignadas a un doctor
    List<CitaJpaEntity> findByDoctorId(String doctorId);
}