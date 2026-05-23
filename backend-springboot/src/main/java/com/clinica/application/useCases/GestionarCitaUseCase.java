package com.clinica.application.useCases;

import com.clinica.domain.entities.Cita;

import java.util.List;

public interface GestionarCitaUseCase {
    Cita solicitarCita(Cita nuevaCita);
    List<Cita> listarPorDoctor(String doctorId);
    List<Cita> listarPorPaciente(String pacienteId);
    Cita actualizarEstado(String id, String estado, String motivoRechazo);
}
