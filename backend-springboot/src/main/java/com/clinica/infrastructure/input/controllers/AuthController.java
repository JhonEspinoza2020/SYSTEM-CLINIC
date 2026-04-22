package com.clinica.infrastructure.input.controllers;

import com.clinica.infrastructure.output.entities.UsuarioJpaEntity;
import com.clinica.infrastructure.output.repositories.UsuarioCrudRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000") 
public class AuthController {

    private final UsuarioCrudRepository usuarioRepository;

    public AuthController(UsuarioCrudRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String correo = credentials.get("correo");
        String password = credentials.get("password");

        System.out.println("\n===== 🕵️‍♂️ INTENTO DE LOGIN =====");
        System.out.println("Correo que React envió: [" + correo + "]");
        System.out.println("Password que React envió: [" + password + "]");

        Optional<UsuarioJpaEntity> usuarioOpt = usuarioRepository.findByCorreo(correo);

        if (usuarioOpt.isPresent()) {
            System.out.println("✅ El usuario SÍ EXISTE en la base de datos.");
            UsuarioJpaEntity usuario = usuarioOpt.get();
            
            if (usuario.getPassword().equals(password)) {
                System.out.println("✅ ¡Contraseña CORRECTA! Abriendo puertas...");
                usuario.setPassword(null);
                return ResponseEntity.ok(usuario);
            } else {
                System.out.println("❌ ERROR: La contraseña no coincide. BD tiene: [" + usuario.getPassword() + "]");
            }
        } else {
            System.out.println("❌ ERROR: Ese correo NO EXISTE en MySQL.");
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Correo o contraseña incorrectos");
    }

    @PostMapping("/registro")
    public ResponseEntity<?> registrarDoctor(@RequestBody UsuarioJpaEntity nuevoDoctor) {
        System.out.println("\n===== 📝 INTENTO DE REGISTRO =====");
        System.out.println("Intentando registrar a: " + nuevoDoctor.getCorreo());

        try {
            if (usuarioRepository.findByCorreo(nuevoDoctor.getCorreo()).isPresent()) {
                System.out.println("❌ ERROR: El correo ya existe.");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error: El correo ya está registrado.");
            }

            nuevoDoctor.setId(java.util.UUID.randomUUID().toString());
            nuevoDoctor.setUsername(nuevoDoctor.getCorreo());
            nuevoDoctor.setRol("DOCTOR");

            usuarioRepository.save(nuevoDoctor);
            System.out.println("✅ ¡Doctor guardado EXITOSAMENTE en MySQL!");
            
            nuevoDoctor.setPassword(null);
            return ResponseEntity.status(HttpStatus.CREATED).body(nuevoDoctor);

        } catch (Exception e) {
            System.out.println("🔥 ERROR FATAL AL GUARDAR EN MYSQL 🔥");
            e.printStackTrace(); // Esto nos dirá exactamente por qué falla
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error interno al registrar");
        }
    }
}