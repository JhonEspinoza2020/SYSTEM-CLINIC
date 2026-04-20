package com.clinica.domain.ports;

import com.clinica.domain.entities.Paciente;
import java.util.List;
import java.util.Optional;

public interface PacienteRepositoryPort {
    
    Paciente guardar(Paciente paciente);
    
    Optional<Paciente> buscarPorId(String id);
    
    Optional<Paciente> buscarPorDni(String dni);
    
    List<Paciente> listarTodos();
    
    // Aquí podrías agregar más adelante algo como: boolean existePorDni(String dni);
}