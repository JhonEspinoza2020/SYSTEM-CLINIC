-- Esquema inicial NovaSalud
CREATE TABLE IF NOT EXISTS usuarios (
    id              VARCHAR(36)  NOT NULL PRIMARY KEY,
    username        VARCHAR(255) NOT NULL,
    password        VARCHAR(255) NOT NULL,
    nombre_completo VARCHAR(255),
    correo          VARCHAR(255),
    especialidad    VARCHAR(255),
    dni_doctor      VARCHAR(20),
    rol             VARCHAR(20),
    estado          VARCHAR(20),
    firma_digital   LONGTEXT,
    CONSTRAINT uk_usuarios_username UNIQUE (username)
);

CREATE TABLE IF NOT EXISTS pacientes (
    id                  VARCHAR(36)  NOT NULL PRIMARY KEY,
    nombre              VARCHAR(150) NOT NULL,
    apellido_paterno    VARCHAR(20),
    apellido_materno    VARCHAR(20),
    dni                 VARCHAR(15)  NOT NULL,
    edad                INT,
    tipo_sangre         VARCHAR(5),
    alergias_conocidas  VARCHAR(255),
    riesgo_predicho     VARCHAR(50),
    recomendacion_ia    VARCHAR(500),
    id_doctor           VARCHAR(36),
    sexo                VARCHAR(10),
    numero_cama         INT,
    historia_clinica    VARCHAR(1000),
    fecha_registro      VARCHAR(20),
    peso_nacer          DOUBLE,
    frecuencia_cardiaca INT,
    escala_glasgow      INT,
    temperatura         DOUBLE,
    nivel_dolor         INT,
    CONSTRAINT uk_pacientes_dni UNIQUE (dni)
);

CREATE TABLE IF NOT EXISTS citas (
    id              VARCHAR(36) NOT NULL PRIMARY KEY,
    paciente_id     VARCHAR(36) NOT NULL,
    doctor_id       VARCHAR(36) NOT NULL,
    nombre_paciente VARCHAR(255),
    nombre_doctor   VARCHAR(255),
    especialidad    VARCHAR(255),
    fecha           VARCHAR(20),
    hora            VARCHAR(10),
    motivo          VARCHAR(500),
    estado          VARCHAR(20),
    motivo_rechazo  VARCHAR(500)
);
