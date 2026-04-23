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
                .apellidoPaterno(paciente.getApellidoPaterno()) // <-- ASEGURA ESTA LÍNEA
                .apellidoMaterno(paciente.getApellidoMaterno()) // <-- ASEGURA ESTA LÍNEA
                .dni(paciente.getDni())
                .edad(paciente.getEdad())
                .tipoSangre(paciente.getTipoSangre())
                .sexo(paciente.getSexo())
                .numeroCama(paciente.getNumeroCama())
                .historiaClinica(paciente.getHistoriaClinica())
                .fechaRegistro(paciente.getFechaRegistro())
                .alergiasConocidas(paciente.getAlergiasConocidas())
                .riesgoPredicho(paciente.getRiesgoPredicho())
                .recomendacionIa(paciente.getRecomendacionIa())
                .idDoctor(paciente.getIdDoctor()) 
                .build();

        PacienteJpaEntity guardado = crudRepository.save(entity);
        return mapToDomain(guardado);
    }

    @Override
    public List<Paciente> buscarPorIdDoctor(String idDoctor) {
        return crudRepository.findByIdDoctor(idDoctor).stream()
                .map(this::mapToDomain)
                .collect(Collectors.toList());
    }

    @Override
    public void eliminar(String id) {
        crudRepository.deleteById(id);
    }

    // Métodos obligatorios
    @Override public Optional<Paciente> buscarPorId(String id) { return crudRepository.findById(id).map(this::mapToDomain); }
    @Override public Optional<Paciente> buscarPorDni(String dni) { return crudRepository.findByDni(dni).map(this::mapToDomain); }
    @Override public List<Paciente> listarTodos() { return crudRepository.findAll().stream().map(this::mapToDomain).collect(Collectors.toList()); }

    private Paciente mapToDomain(PacienteJpaEntity entity) {
        return Paciente.builder()
                .id(entity.getId())
                .nombre(entity.getNombre())
                .apellidoPaterno(entity.getApellidoPaterno()) // <-- ESTO ES LO QUE FALTABA
                .apellidoMaterno(entity.getApellidoMaterno()) // <-- ESTO ES LO QUE FALTABA
                .dni(entity.getDni())
                .edad(entity.getEdad())
                .tipoSangre(entity.getTipoSangre())
                .alergiasConocidas(entity.getAlergiasConocidas())
                .riesgoPredicho(entity.getRiesgoPredicho())
                .recomendacionIa(entity.getRecomendacionIa())
                .idDoctor(entity.getIdDoctor()) 
                .sexo(entity.getSexo())
                .numeroCama(entity.getNumeroCama())
                .historiaClinica(entity.getHistoriaClinica())
                .fechaRegistro(entity.getFechaRegistro())
                .build();
    }
}