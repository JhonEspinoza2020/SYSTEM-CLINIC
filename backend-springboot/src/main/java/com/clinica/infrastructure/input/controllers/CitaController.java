package com.clinica.infrastructure.input.controllers;

import com.clinica.infrastructure.output.entities.CitaJpaEntity;
import com.clinica.infrastructure.output.repositories.CitaCrudRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/citas")
@CrossOrigin(origins = "http://localhost:3000")
public class CitaController {

    private final CitaCrudRepository citaRepository;

    public CitaController(CitaCrudRepository citaRepository) {
        this.citaRepository = citaRepository;
    }

    // 1. EL PACIENTE SOLICITA UNA CITA
    @PostMapping
    public ResponseEntity<?> solicitarCita(@RequestBody CitaJpaEntity nuevaCita) {
        try {
            nuevaCita.setId(UUID.randomUUID().toString());
            nuevaCita.setEstado("PENDIENTE");
            CitaJpaEntity guardada = citaRepository.save(nuevaCita);
            return ResponseEntity.status(HttpStatus.CREATED).body(guardada);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al registrar la cita");
        }
    }

    // 2. OBTENER LAS CITAS DE UN DOCTOR ESPECÍFICO (Para su Dashboard)
    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<List<CitaJpaEntity>> obtenerCitasDoctor(@PathVariable String doctorId) {
        List<CitaJpaEntity> citas = citaRepository.findByDoctorId(doctorId);
        return ResponseEntity.ok(citas);
    }

    // 3. OBTENER LAS CITAS DE UN PACIENTE ESPECÍFICO (Para su Portal)
    @GetMapping("/paciente/{pacienteId}")
    public ResponseEntity<List<CitaJpaEntity>> obtenerCitasPaciente(@PathVariable String pacienteId) {
        List<CitaJpaEntity> citas = citaRepository.findByPacienteId(pacienteId);
        return ResponseEntity.ok(citas);
    }

    // 4. EL DOCTOR ACEPTA O RECHAZA LA CITA
    @PutMapping("/{id}/estado")
    public ResponseEntity<?> actualizarEstadoCita(@PathVariable String id, @RequestBody Map<String, String> request) {
        Optional<CitaJpaEntity> citaOpt = citaRepository.findById(id);
        
        if (citaOpt.isPresent()) {
            CitaJpaEntity cita = citaOpt.get();
            cita.setEstado(request.get("estado")); // Recibe: CONFIRMADA o RECHAZADA
            
            // Si el doctor rechaza, guarda el motivo
            if (request.containsKey("motivoRechazo")) {
                cita.setMotivoRechazo(request.get("motivoRechazo"));
            }
            
            citaRepository.save(cita);
            return ResponseEntity.ok(Map.of("mensaje", "Cita actualizada a " + cita.getEstado()));
        }
        
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Cita no encontrada"));
    }
}