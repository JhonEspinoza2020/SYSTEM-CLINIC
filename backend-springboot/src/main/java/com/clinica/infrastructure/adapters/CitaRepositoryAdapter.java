package com.clinica.infrastructure.adapters;

import com.clinica.domain.entities.Cita;
import com.clinica.domain.ports.CitaRepositoryPort;
import com.clinica.infrastructure.output.entities.CitaJpaEntity;
import com.clinica.infrastructure.output.repositories.CitaCrudRepository;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
public class CitaRepositoryAdapter implements CitaRepositoryPort {

    private final CitaCrudRepository crudRepository;

    public CitaRepositoryAdapter(CitaCrudRepository crudRepository) {
        this.crudRepository = crudRepository;
    }

    @Override
    public Cita guardar(Cita cita) {
        return mapToDomain(crudRepository.save(mapToEntity(cita)));
    }

    @Override
    public Optional<Cita> buscarPorId(String id) {
        return crudRepository.findById(id).map(this::mapToDomain);
    }

    @Override
    public List<Cita> buscarPorDoctorId(String doctorId) {
        return crudRepository.findByDoctorId(doctorId).stream().map(this::mapToDomain).collect(Collectors.toList());
    }

    @Override
    public List<Cita> buscarPorPacienteId(String pacienteId) {
        return crudRepository.findByPacienteId(pacienteId).stream().map(this::mapToDomain).collect(Collectors.toList());
    }

    private CitaJpaEntity mapToEntity(Cita c) {
        return CitaJpaEntity.builder()
                .id(c.getId())
                .pacienteId(c.getPacienteId())
                .doctorId(c.getDoctorId())
                .nombrePaciente(c.getNombrePaciente())
                .nombreDoctor(c.getNombreDoctor())
                .especialidad(c.getEspecialidad())
                .fecha(c.getFecha())
                .hora(c.getHora())
                .motivo(c.getMotivo())
                .estado(c.getEstado())
                .motivoRechazo(c.getMotivoRechazo())
                .build();
    }

    private Cita mapToDomain(CitaJpaEntity e) {
        return Cita.builder()
                .id(e.getId())
                .pacienteId(e.getPacienteId())
                .doctorId(e.getDoctorId())
                .nombrePaciente(e.getNombrePaciente())
                .nombreDoctor(e.getNombreDoctor())
                .especialidad(e.getEspecialidad())
                .fecha(e.getFecha())
                .hora(e.getHora())
                .motivo(e.getMotivo())
                .estado(e.getEstado())
                .motivoRechazo(e.getMotivoRechazo())
                .build();
    }
}
