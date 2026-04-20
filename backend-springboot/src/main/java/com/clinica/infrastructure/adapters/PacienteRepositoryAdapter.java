package com.clinica.infrastructure.adapters;

import com.clinica.domain.entities.Paciente;
import com.clinica.domain.ports.PacienteRepositoryPort;
import com.clinica.infrastructure.output.entities.PacienteJpaEntity;
import com.clinica.infrastructure.output.repositories.PacienteCrudRepository;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
public class PacienteRepositoryAdapter implements PacienteRepositoryPort {

    private final PacienteCrudRepository crudRepository;

    public PacienteRepositoryAdapter(PacienteCrudRepository crudRepository) {
        this.crudRepository = crudRepository;
    }

    @Override
    public Paciente guardar(Paciente paciente) {
        PacienteJpaEntity entity = PacienteJpaEntity.builder()
                .id(paciente.getId())
                .nombre(paciente.getNombre())
                .dni(paciente.getDni())
                .edad(paciente.getEdad())
                .tipoSangre(paciente.getTipoSangre())
                .alergiasConocidas(paciente.getAlergiasConocidas())
                .build();

        PacienteJpaEntity guardado = crudRepository.save(entity);
        return mapToDomain(guardado);
    }

    @Override
    public Optional<Paciente> buscarPorId(String id) {
        return crudRepository.findById(id).map(this::mapToDomain);
    }

    @Override
    public Optional<Paciente> buscarPorDni(String dni) {
        return crudRepository.findByDni(dni).map(this::mapToDomain);
    }

    @Override
    public List<Paciente> listarTodos() {
        return crudRepository.findAll().stream()
                .map(this::mapToDomain)
                .collect(Collectors.toList());
    }

    private Paciente mapToDomain(PacienteJpaEntity entity) {
        return Paciente.builder()
                .id(entity.getId())
                .nombre(entity.getNombre())
                .dni(entity.getDni())
                .edad(entity.getEdad())
                .tipoSangre(entity.getTipoSangre())
                .alergiasConocidas(entity.getAlergiasConocidas())
                .build();
    }
}
