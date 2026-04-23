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

        // --- VALIDACIÓN: BLOQUEAR DNI DUPLICADO ---
        pacienteRepositoryPort.buscarPorDni(paciente.getDni()).ifPresent(p -> {
            throw new RuntimeException("El DNI " + paciente.getDni() + " ya está registrado en el sistema.");
        });
        
        // 1. CONEXIÓN AL MICROSERVICIO DE IA EN PYTHON
        try {
            RestTemplate restTemplate = new RestTemplate();
            Map<String, Object> requestIa = new HashMap<>();
            
            // Datos generales
            requestIa.put("edad", paciente.getEdad());
            requestIa.put("tipo_sangre", paciente.getTipoSangre());
            requestIa.put("alergias_conocidas", paciente.getAlergiasConocidas() != null ? paciente.getAlergiasConocidas() : "Ninguna");

            // --- NUEVOS DATOS PARA LA IA POR ESPECIALIDAD ---
            requestIa.put("peso_nacer", paciente.getPesoNacer());
            requestIa.put("frecuencia_cardiaca", paciente.getFrecuenciaCardiaca());
            requestIa.put("escala_glasgow", paciente.getEscalaGlasgow());
            requestIa.put("temperatura", paciente.getTemperatura());
            requestIa.put("nivel_dolor", paciente.getNivelDolor());

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
    
    @Override 
    public Paciente obtenerPacientePorDni(String dni) { return pacienteRepositoryPort.buscarPorDni(dni).orElse(null); }
    
    @Override 
    public List<Paciente> listarTodosLosPacientes() { return pacienteRepositoryPort.listarTodos(); }
    
    @Override
    public Paciente actualizarPaciente(String id, Paciente pacienteActualizado) {
        Paciente pacienteExistente = pacienteRepositoryPort.buscarPorId(id)
                .orElseThrow(() -> new RuntimeException("Paciente no encontrado"));

        // Protegemos los datos que NO deben cambiar
        pacienteActualizado.setId(pacienteExistente.getId());
        pacienteActualizado.setDni(pacienteExistente.getDni());
        pacienteActualizado.setNumeroCama(pacienteExistente.getNumeroCama());
        pacienteActualizado.setHistoriaClinica(pacienteExistente.getHistoriaClinica());
        pacienteActualizado.setFechaRegistro(pacienteExistente.getFechaRegistro());
        pacienteActualizado.setIdDoctor(pacienteExistente.getIdDoctor());

        // Volvemos a consultar a la IA
        try {
            RestTemplate restTemplate = new RestTemplate();
            Map<String, Object> requestIa = new HashMap<>();
            
            requestIa.put("edad", pacienteActualizado.getEdad());
            requestIa.put("tipo_sangre", pacienteActualizado.getTipoSangre());
            requestIa.put("alergias_conocidas", pacienteActualizado.getAlergiasConocidas() != null ? pacienteActualizado.getAlergiasConocidas() : "Ninguna");
            
            // --- NUEVOS DATOS PARA LA IA AL ACTUALIZAR ---
            requestIa.put("peso_nacer", pacienteActualizado.getPesoNacer());
            requestIa.put("frecuencia_cardiaca", pacienteActualizado.getFrecuenciaCardiaca());
            requestIa.put("escala_glasgow", pacienteActualizado.getEscalaGlasgow());
            requestIa.put("temperatura", pacienteActualizado.getTemperatura());
            requestIa.put("nivel_dolor", pacienteActualizado.getNivelDolor());

            String urlIA = "http://127.0.0.1:8000/api/ia/evaluar-riesgo";
            ResponseEntity<Map> response = restTemplate.postForEntity(urlIA, requestIa, Map.class);
            
            if (response.getBody() != null) {
                pacienteActualizado.setRiesgoPredicho((String) response.getBody().get("riesgo_predicho"));
                pacienteActualizado.setRecomendacionIa((String) response.getBody().get("recomendacion_ia"));
            }
        } catch (Exception e) {
            pacienteActualizado.setRiesgoPredicho(pacienteExistente.getRiesgoPredicho());
            pacienteActualizado.setRecomendacionIa(pacienteExistente.getRecomendacionIa());
        }

        return pacienteRepositoryPort.guardar(pacienteActualizado);
    }
}