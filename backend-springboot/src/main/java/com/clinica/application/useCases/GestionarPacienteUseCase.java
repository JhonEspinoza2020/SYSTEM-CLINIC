package com.clinica.application.useCases;

import com.clinica.domain.entities.Paciente;
import java.util.List;

public interface GestionarPacienteUseCase {
    
    Paciente registrarNuevoPaciente(Paciente paciente);
    
    Paciente obtenerPacientePorId(String id);
    
    Paciente obtenerPacientePorDni(String dni);
    
    List<Paciente> listarTodosLosPacientes();
}