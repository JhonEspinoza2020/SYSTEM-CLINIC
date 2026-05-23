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
public class Cita {
    private String id;
    private String pacienteId;
    private String doctorId;
    private String nombrePaciente;
    private String nombreDoctor;
    private String especialidad;
    private String fecha;
    private String hora;
    private String motivo;
    private String estado;
    private String motivoRechazo;
}
