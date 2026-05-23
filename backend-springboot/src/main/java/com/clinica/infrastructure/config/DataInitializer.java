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
    }
}
