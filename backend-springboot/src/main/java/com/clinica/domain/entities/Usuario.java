package com.clinica.domain.entities;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Usuario {
    private String id;
    private String username; // Correo institucional
    private String password;
    private String nombre;
    private String rol; // Ejemplo: "ROLE_DOCTOR"
}