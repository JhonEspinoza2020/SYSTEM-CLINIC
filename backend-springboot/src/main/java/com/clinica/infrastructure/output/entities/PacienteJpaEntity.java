package com.clinica.infrastructure.output.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "pacientes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PacienteJpaEntity {

    @Id
    @Column(name = "id", length = 36, nullable = false)
    private String id;

    @Column(name = "nombre", length = 150, nullable = false)
    private String nombre;

    @Column(name = "apellido_paterno", length = 20)
    private String apellidoPaterno;

    @Column(name = "apellido_materno", length = 20)
    private String apellidoMaterno;

    @Column(name = "dni", length = 15, unique = true, nullable = false)
    private String dni;

    @Column(name = "edad")
    private Integer edad;

    @Column(name = "tipo_sangre", length = 5)
    private String tipoSangre;

    @Column(name = "alergias_conocidas")
    private String alergiasConocidas;

    @Column(name = "riesgo_predicho", length = 50)
    private String riesgoPredicho;

    @Column(name = "recomendacion_ia", length = 500)
    private String recomendacionIa;

    @Column(name = "id_doctor", length = 36)
    private String idDoctor;
}