package com.clinica.application.services;

import com.clinica.application.useCases.GestionarPacienteUseCase;
import com.clinica.domain.entities.Paciente;
import com.clinica.domain.ports.PacienteRepositoryPort;
import com.clinica.infrastructure.external.IaRiskClient;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class PacienteServiceImpl implements GestionarPacienteUseCase {

    private final PacienteRepositoryPort pacienteRepositoryPort;
    private final IaRiskClient iaRiskClient;

    public PacienteServiceImpl(PacienteRepositoryPort pacienteRepositoryPort, IaRiskClient iaRiskClient) {
        this.pacienteRepositoryPort = pacienteRepositoryPort;
        this.iaRiskClient = iaRiskClient;
    }

    @Override
    public Paciente registrarNuevoPaciente(Paciente paciente) {
        if (paciente.getId() == null || paciente.getId().isEmpty()) {
            paciente.setId(UUID.randomUUID().toString());
        }

        pacienteRepositoryPort.buscarPorDni(paciente.getDni()).ifPresent(p -> {
            throw new RuntimeException("El DNI " + paciente.getDni() + " ya está registrado en el sistema.");
        });

        aplicarEvaluacionIa(paciente, true);
        return pacienteRepositoryPort.guardar(paciente);
    }

    @Override
    public List<Paciente> listarPacientesPorDoctor(String idDoctor) {
        return pacienteRepositoryPort.buscarPorIdDoctor(idDoctor);
    }

    @Override
    public void eliminarPaciente(String id) {
        pacienteRepositoryPort.eliminar(id);
    }

    @Override
    public Paciente obtenerPacientePorId(String id) {
        return pacienteRepositoryPort.buscarPorId(id).orElse(null);
    }

    @Override
    public Paciente obtenerPacientePorDni(String dni) {
        return pacienteRepositoryPort.buscarPorDni(dni).orElse(null);
    }

    @Override
    public List<Paciente> listarTodosLosPacientes() {
        return pacienteRepositoryPort.listarTodos();
    }

    @Override
    public Paciente actualizarPaciente(String id, Paciente pacienteActualizado) {
        Paciente pacienteExistente = pacienteRepositoryPort.buscarPorId(id)
                .orElseThrow(() -> new RuntimeException("Paciente no encontrado"));

        pacienteActualizado.setId(pacienteExistente.getId());
        pacienteActualizado.setDni(pacienteExistente.getDni());
        pacienteActualizado.setNumeroCama(pacienteExistente.getNumeroCama());
        pacienteActualizado.setHistoriaClinica(pacienteExistente.getHistoriaClinica());
        pacienteActualizado.setFechaRegistro(pacienteExistente.getFechaRegistro());
        pacienteActualizado.setIdDoctor(pacienteExistente.getIdDoctor());

        aplicarEvaluacionIa(pacienteActualizado, false);
        if (pacienteActualizado.getRiesgoPredicho() == null) {
            pacienteActualizado.setRiesgoPredicho(pacienteExistente.getRiesgoPredicho());
            pacienteActualizado.setRecomendacionIa(pacienteExistente.getRecomendacionIa());
        }

        return pacienteRepositoryPort.guardar(pacienteActualizado);
    }

    private void aplicarEvaluacionIa(Paciente paciente, boolean esRegistro) {
        iaRiskClient.evaluarRiesgo(paciente).ifPresentOrElse(
                resultado -> {
                    paciente.setRiesgoPredicho(resultado.get("riesgo_predicho"));
                    paciente.setRecomendacionIa(resultado.get("recomendacion_ia"));
                },
                () -> {
                    if (esRegistro) {
                        paciente.setRiesgoPredicho("PENDIENTE");
                        paciente.setRecomendacionIa("IA no disponible en este momento");
                    }
                }
        );
    }
}
