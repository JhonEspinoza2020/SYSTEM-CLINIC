package com.clinica.application.services;

import com.clinica.application.useCases.GestionarCitaUseCase;
import com.clinica.domain.entities.Cita;
import com.clinica.domain.ports.CitaRepositoryPort;
import com.clinica.infrastructure.external.WebSocketNotificationService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class CitaServiceImpl implements GestionarCitaUseCase {

    private final CitaRepositoryPort citaRepository;
    private final WebSocketNotificationService notificationService;

    public CitaServiceImpl(CitaRepositoryPort citaRepository, WebSocketNotificationService notificationService) {
        this.citaRepository = citaRepository;
        this.notificationService = notificationService;
    }

    @Override
    public Cita solicitarCita(Cita nuevaCita) {
        nuevaCita.setId(UUID.randomUUID().toString());
        nuevaCita.setEstado("PENDIENTE");
        Cita guardada = citaRepository.guardar(nuevaCita);
        notificationService.notificarDoctor(
                guardada.getDoctorId(),
                "¡Tienes una nueva solicitud de cita de " + guardada.getNombrePaciente() + "!"
        );
        return guardada;
    }

    @Override
    public List<Cita> listarPorDoctor(String doctorId) {
        return citaRepository.buscarPorDoctorId(doctorId);
    }

    @Override
    public List<Cita> listarPorPaciente(String pacienteId) {
        return citaRepository.buscarPorPacienteId(pacienteId);
    }

    @Override
    public Cita actualizarEstado(String id, String estado, String motivoRechazo) {
        Cita cita = citaRepository.buscarPorId(id)
                .orElseThrow(() -> new RuntimeException("Cita no encontrada"));
        cita.setEstado(estado);
        if (motivoRechazo != null) {
            cita.setMotivoRechazo(motivoRechazo);
        }
        Cita actualizada = citaRepository.guardar(cita);
        notificationService.notificarDoctor(
                actualizada.getDoctorId(),
                "Tu cita fue " + estado.toLowerCase()
        );
        return actualizada;
    }
}
