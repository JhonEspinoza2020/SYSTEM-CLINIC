package com.clinica.domain.entities;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HistoriaClinica {
    
    private String id;
    private String pacienteId; // Referencia al Paciente
    private LocalDateTime fechaRegistro;
    
}