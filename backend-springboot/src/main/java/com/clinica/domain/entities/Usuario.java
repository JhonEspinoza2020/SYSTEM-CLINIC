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
public class Usuario {
    private String id;
    private String username;
    private String password;
    private String nombreCompleto;
    private String correo;
    private String especialidad;
    private String dniDoctor;
    private String rol;
    private String estado;
    private String firmaDigital;
}
