package com.clinica.domain.ports;

import com.clinica.domain.entities.HistoriaClinica;
import java.util.List;
import java.util.Optional;

public interface HistoriaClinicaRepositoryPort {
    
    HistoriaClinica guardar(HistoriaClinica historiaClinica);
    
    Optional<HistoriaClinica> buscarPorId(String id);
    
    List<HistoriaClinica> buscarPorPacienteId(String pacienteId);
}