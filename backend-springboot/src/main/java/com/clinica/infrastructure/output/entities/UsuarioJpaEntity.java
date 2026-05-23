package com.clinica.infrastructure.output.entities;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "usuarios")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UsuarioJpaEntity {
    @Id
    @Column(length = 36)
    private String id;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(nullable = false)
    private String password;

    private String nombreCompleto;
    private String correo;
    private String especialidad;
    private String dniDoctor;

    // NUEVOS CAMPOS DE SEGURIDAD MULTIRROL
    private String rol;    // ADMIN, DOCTOR, PACIENTE
    private String estado; // ACTIVO, INACTIVO, PENDIENTE
    
    @Column(columnDefinition = "LONGTEXT")
    private String firmaDigital; // Para la firma en Base64
}