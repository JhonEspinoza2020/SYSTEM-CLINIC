package com.clinica.application.services;

import com.clinica.application.useCases.GestionarPacienteUseCase;
import com.clinica.domain.entities.Paciente;
import com.clinica.domain.ports.PacienteRepositoryPort;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

// Usamos @Service para que Spring Boot reconozca esta clase y la inyecte automáticamente
@Service
public class PacienteServiceImpl implements GestionarPacienteUseCase {

    private final PacienteRepositoryPort pacienteRepositoryPort;

    // Inyección de dependencias a través del constructor
    public PacienteServiceImpl(PacienteRepositoryPort pacienteRepositoryPort) {
        this.pacienteRepositoryPort = pacienteRepositoryPort;
    }

    @Override
    public Paciente registrarNuevoPaciente(Paciente paciente) {
        // Regla de negocio: Generar un UUID si el paciente es nuevo
        if (paciente.getId() == null || paciente.getId().isEmpty()) {
            paciente.setId(UUID.randomUUID().toString());
        }
        
        // Regla de negocio: Verificar si ya existe alguien con ese DNI (Opcional, pero recomendado)
        pacienteRepositoryPort.buscarPorDni(paciente.getDni()).ifPresent(p -> {
            throw new RuntimeException("Ya existe un paciente registrado con el DNI: " + paciente.getDni());
        });

        // Llamamos al puerto para que lo guarde (no nos importa cómo lo hace)
        return pacienteRepositoryPort.guardar(paciente);
    }

    @Override
    public Paciente obtenerPacientePorId(String id) {
        return pacienteRepositoryPort.buscarPorId(id)
                .orElseThrow(() -> new RuntimeException("Paciente no encontrado con ID: " + id));
    }

    @Override
    public Paciente obtenerPacientePorDni(String dni) {
        return pacienteRepositoryPort.buscarPorDni(dni)
                .orElseThrow(() -> new RuntimeException("Paciente no encontrado con DNI: " + dni));
    }

    @Override
    public List<Paciente> listarTodosLosPacientes() {
        return pacienteRepositoryPort.listarTodos();
    }
}