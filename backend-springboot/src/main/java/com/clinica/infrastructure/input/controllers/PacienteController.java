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

    // 1. REGISTRAR PACIENTE
    @PostMapping
    public ResponseEntity<Paciente> registrarPaciente(@RequestBody Paciente paciente) {
        Paciente nuevoPaciente = gestionarPacienteUseCase.registrarNuevoPaciente(paciente);
        return new ResponseEntity<>(nuevoPaciente, HttpStatus.CREATED);
    }

    // 2. LISTAR PACIENTES POR DOCTOR (Para el Dashboard del Médico)
    @GetMapping("/doctor/{idDoctor}")
    public ResponseEntity<List<Paciente>> listarPorDoctor(@PathVariable String idDoctor) {
        return ResponseEntity.ok(gestionarPacienteUseCase.listarPacientesPorDoctor(idDoctor));
    }

    // 3. ELIMINAR PACIENTE
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarPaciente(@PathVariable String id) {
        gestionarPacienteUseCase.eliminarPaciente(id);
        return ResponseEntity.noContent().build();
    }

    // 4. LISTAR TODOS LOS PACIENTES (Para el Dashboard del Admin)
    // He añadido el path "/todos" para que coincida exactamente con la intención del Admin
    @GetMapping("/todos")
    public ResponseEntity<List<Paciente>> listarTodosParaAdmin() {
        return ResponseEntity.ok(gestionarPacienteUseCase.listarTodosLosPacientes());
    }

    // 5. RUTA PARA EDITAR
    @PutMapping("/{id}")
    public ResponseEntity<Paciente> actualizarPaciente(@PathVariable String id, @RequestBody Paciente pacienteActualizado) {
        Paciente pacienteGuardado = gestionarPacienteUseCase.actualizarPaciente(id, pacienteActualizado);
        return ResponseEntity.ok(pacienteGuardado);
    }
}