package com.clinica.application.useCases;

import com.clinica.domain.entities.Paciente;
import java.util.List;

public interface GestionarPacienteUseCase {
    Paciente registrarNuevoPaciente(Paciente paciente);
    Paciente obtenerPacientePorId(String id);
    Paciente obtenerPacientePorDni(String dni);
    List<Paciente> listarTodosLosPacientes();
    List<Paciente> listarPacientesPorDoctor(String idDoctor);
    
   // ... tus otros métodos ...
    void eliminarPaciente(String id);
    
    // --- NUEVO MÉTODO PARA EDITAR ---
    Paciente actualizarPaciente(String id, Paciente pacienteActualizado);
}