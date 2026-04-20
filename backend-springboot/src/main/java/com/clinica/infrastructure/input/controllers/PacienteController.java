package com.clinica.infrastructure.input.controllers;

import com.clinica.application.useCases.GestionarPacienteUseCase;
import com.clinica.domain.entities.Paciente;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pacientes")
@CrossOrigin(origins = "http://localhost:3000") // <--- Modificado específicamente para tu React
public class PacienteController {

    private final GestionarPacienteUseCase gestionarPacienteUseCase;

    // Inyectamos el Caso de Uso (Application), NO el Repositorio directamente. ¡Pura arquitectura hexagonal!
    public PacienteController(GestionarPacienteUseCase gestionarPacienteUseCase) {
        this.gestionarPacienteUseCase = gestionarPacienteUseCase;
    }

    @PostMapping
    public ResponseEntity<Paciente> registrarPaciente(@RequestBody Paciente paciente) {
        Paciente nuevoPaciente = gestionarPacienteUseCase.registrarNuevoPaciente(paciente);
        return new ResponseEntity<>(nuevoPaciente, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Paciente>> listarTodos() {
        return ResponseEntity.ok(gestionarPacienteUseCase.listarTodosLosPacientes());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Paciente> obtenerPorId(@PathVariable String id) {
        return ResponseEntity.ok(gestionarPacienteUseCase.obtenerPacientePorId(id));
    }

    @GetMapping("/dni/{dni}")
    public ResponseEntity<Paciente> obtenerPorDni(@PathVariable String dni) {
        return ResponseEntity.ok(gestionarPacienteUseCase.obtenerPacientePorDni(dni));
    }
}