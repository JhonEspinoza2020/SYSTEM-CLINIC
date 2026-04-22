package com.clinica.application.services;

import com.clinica.application.useCases.GestionarPacienteUseCase;
import com.clinica.domain.entities.Paciente;
import com.clinica.domain.ports.PacienteRepositoryPort;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.ResponseEntity;
import java.util.*;

@Service
public class PacienteServiceImpl implements GestionarPacienteUseCase {

    private final PacienteRepositoryPort pacienteRepositoryPort;

    public PacienteServiceImpl(PacienteRepositoryPort pacienteRepositoryPort) {
        this.pacienteRepositoryPort = pacienteRepositoryPort;
    }

    @Override
    public Paciente registrarNuevoPaciente(Paciente paciente) {
        if (paciente.getId() == null || paciente.getId().isEmpty()) {
            paciente.setId(UUID.randomUUID().toString());
        }
        
        // 1. CONEXIÓN AL MICROSERVICIO DE IA (Corregido para Python)
        try {
            RestTemplate restTemplate = new RestTemplate();
            Map<String, Object> requestIa = new HashMap<>();
            
            requestIa.put("edad", paciente.getEdad());
            requestIa.put("tipo_sangre", paciente.getTipoSangre());
            // IMPORTANTE: Python espera "alergias_conocidas"
            requestIa.put("alergias_conocidas", paciente.getAlergiasConocidas());

            String urlIA = "http://127.0.0.1:8000/api/ia/evaluar-riesgo";
            ResponseEntity<Map> response = restTemplate.postForEntity(urlIA, requestIa, Map.class);
            
            if (response.getBody() != null) {
                paciente.setRiesgoPredicho((String) response.getBody().get("riesgo_predicho"));
                paciente.setRecomendacionIa((String) response.getBody().get("recomendacion_ia"));
            }
        } catch (Exception e) {
            paciente.setRiesgoPredicho("PENDIENTE");
            paciente.setRecomendacionIa("IA no disponible: " + e.getMessage());
        }

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
    public Paciente obtenerPacientePorId(String id) { return pacienteRepositoryPort.buscarPorId(id).orElse(null); }
    @Override public Paciente obtenerPacientePorDni(String dni) { return pacienteRepositoryPort.buscarPorDni(dni).orElse(null); }
    @Override public List<Paciente> listarTodosLosPacientes() { return pacienteRepositoryPort.listarTodos(); }
}