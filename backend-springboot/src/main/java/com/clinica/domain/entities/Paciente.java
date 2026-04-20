package com.clinica.domain.entities;

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
public class Paciente {
    
    private String id; // nvarchar36 (UUID)
    private String nombre; // nvarchar150
    private String dni; // nvarchar15
    
    private Integer edad;
    private String tipoSangre;
    private String alergiasConocidas; // Importante para la IA preventiva

}