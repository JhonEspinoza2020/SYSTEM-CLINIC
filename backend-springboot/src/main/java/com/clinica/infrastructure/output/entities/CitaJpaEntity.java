package com.clinica.infrastructure.output.entities;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "citas")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CitaJpaEntity {
    
    @Id
    @Column(length = 36)
    private String id;
    
    @Column(nullable = false)
    private String pacienteId;
    
    @Column(nullable = false)
    private String doctorId;
    
    private String nombrePaciente;
    private String nombreDoctor;
    private String especialidad;
    private String fecha;
    private String hora;
    private String motivo;
    
    // PENDIENTE, CONFIRMADA, RECHAZADA, ATENDIDA
    private String estado; 
    
    private String motivoRechazo;
}