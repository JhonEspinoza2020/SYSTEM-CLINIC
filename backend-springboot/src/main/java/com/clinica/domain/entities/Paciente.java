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
    private String id;
    private String nombre;
    private String apellidoPaterno;
    private String apellidoMaterno;
    private String dni;
    private Integer edad;
    private String tipoSangre;
    private String alergiasConocidas;
    private String riesgoPredicho;
    private String recomendacionIa;
    private String idDoctor;
}