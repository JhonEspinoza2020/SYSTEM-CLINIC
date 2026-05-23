package com.clinica.infrastructure.input.controllers;

import com.clinica.application.useCases.GestionarCitaUseCase;
import com.clinica.domain.entities.Cita;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/citas")
public class CitaController {

    private final GestionarCitaUseCase gestionarCitaUseCase;

    public CitaController(GestionarCitaUseCase gestionarCitaUseCase) {
        this.gestionarCitaUseCase = gestionarCitaUseCase;
    }

    @PostMapping
    public ResponseEntity<Cita> solicitarCita(@RequestBody Cita nuevaCita) {
        Cita guardada = gestionarCitaUseCase.solicitarCita(nuevaCita);
        return ResponseEntity.status(HttpStatus.CREATED).body(guardada);
    }

    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<List<Cita>> obtenerCitasDoctor(@PathVariable String doctorId) {
        return ResponseEntity.ok(gestionarCitaUseCase.listarPorDoctor(doctorId));
    }

    @GetMapping("/paciente/{pacienteId}")
    public ResponseEntity<List<Cita>> obtenerCitasPaciente(@PathVariable String pacienteId) {
        return ResponseEntity.ok(gestionarCitaUseCase.listarPorPaciente(pacienteId));
    }

    @PutMapping("/{id}/estado")
    public ResponseEntity<Cita> actualizarEstadoCita(@PathVariable String id, @RequestBody Map<String, String> request) {
        Cita actualizada = gestionarCitaUseCase.actualizarEstado(
                id,
                request.get("estado"),
                request.get("motivoRechazo")
        );
        return ResponseEntity.ok(actualizada);
    }
}
