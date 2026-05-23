package com.clinica.domain.ports;

import com.clinica.domain.entities.Cita;

import java.util.List;
import java.util.Optional;

public interface CitaRepositoryPort {
    Cita guardar(Cita cita);
    Optional<Cita> buscarPorId(String id);
    List<Cita> buscarPorDoctorId(String doctorId);
    List<Cita> buscarPorPacienteId(String pacienteId);
}
