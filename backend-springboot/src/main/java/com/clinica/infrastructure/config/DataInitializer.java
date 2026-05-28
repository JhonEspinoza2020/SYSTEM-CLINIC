package com.clinica.infrastructure.config;

import com.clinica.domain.entities.Usuario;
import com.clinica.domain.ports.UsuarioRepositoryPort;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UsuarioRepositoryPort usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.admin.email}")
    private String adminEmail;

    @Value("${app.admin.password}")
    private String adminPassword;

    @Value("${app.test.doctor.email:doctor.cypress@novasalud.com}")
    private String testDoctorEmail;

    @Value("${app.test.doctor.password:DoctorCypress2026!}")
    private String testDoctorPassword;

    @Value("${app.test.patient.email:paciente.cypress@novasalud.com}")
    private String testPatientEmail;

    @Value("${app.test.patient.password:PacienteCypress2026!}")
    private String testPatientPassword;

    public DataInitializer(UsuarioRepositoryPort usuarioRepository, PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (usuarioRepository.buscarPorCorreo(adminEmail).isEmpty()) {
            Usuario admin = Usuario.builder()
                    .id(UUID.randomUUID().toString())
                    .username(adminEmail)
                    .correo(adminEmail)
                    .nombreCompleto("Administrador NovaSalud")
                    .password(passwordEncoder.encode(adminPassword))
                    .rol("ADMIN")
                    .estado("ACTIVO")
                    .build();
            usuarioRepository.guardar(admin);
        }
        seedUsuarioSiNoExiste(testDoctorEmail, testDoctorPassword, "DOCTOR",
                "Dr. Cypress Pruebas", "Medicina General", null);
        seedUsuarioSiNoExiste(testPatientEmail, testPatientPassword, "PACIENTE",
                "Paciente Cypress Pruebas", null, null);
    }

    private void seedUsuarioSiNoExiste(String correo, String password, String rol,
                                       String nombre, String especialidad, String dni) {
        if (usuarioRepository.buscarPorCorreo(correo).isPresent()) {
            return;
        }
        Usuario.UsuarioBuilder builder = Usuario.builder()
                .id(UUID.randomUUID().toString())
                .username(correo)
                .correo(correo)
                .nombreCompleto(nombre)
                .password(passwordEncoder.encode(password))
                .rol(rol)
                .estado("ACTIVO");
        if (especialidad != null) {
            builder.especialidad(especialidad);
        }
        if (dni != null) {
            builder.dniDoctor(dni);
        }
        usuarioRepository.guardar(builder.build());
    }
}
