package com.clinica.infrastructure.input.controllers;

import com.clinica.application.useCases.GestionarPacienteUseCase;
import com.clinica.domain.entities.Paciente;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/pacientes")
@CrossOrigin(origins = "http://localhost:3000")
public class PacienteController {

    private final GestionarPacienteUseCase gestionarPacienteUseCase;

    public PacienteController(GestionarPacienteUseCase gestionarPacienteUseCase) {
        this.gestionarPacienteUseCase = gestionarPacienteUseCase;
    }

    @PostMapping
    public ResponseEntity<Paciente> registrarPaciente(@RequestBody Paciente paciente) {
        Paciente nuevoPaciente = gestionarPacienteUseCase.registrarNuevoPaciente(paciente);
        return new ResponseEntity<>(nuevoPaciente, HttpStatus.CREATED);
    }

    @GetMapping("/doctor/{idDoctor}")
    public ResponseEntity<List<Paciente>> listarPorDoctor(@PathVariable String idDoctor) {
        return ResponseEntity.ok(gestionarPacienteUseCase.listarPacientesPorDoctor(idDoctor));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarPaciente(@PathVariable String id) {
        gestionarPacienteUseCase.eliminarPaciente(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<List<Paciente>> listarTodos() {
        return ResponseEntity.ok(gestionarPacienteUseCase.listarTodosLosPacientes());
    }

    // ... tus otros endpoints (@GetMapping, @DeleteMapping) ...

    // --- NUEVA RUTA PARA EDITAR (REACT LLAMARÁ AQUÍ) ---
    @PutMapping("/{id}")
    public ResponseEntity<Paciente> actualizarPaciente(@PathVariable String id, @RequestBody Paciente pacienteActualizado) {
        Paciente pacienteGuardado = gestionarPacienteUseCase.actualizarPaciente(id, pacienteActualizado);
        return ResponseEntity.ok(pacienteGuardado);
    }
}
