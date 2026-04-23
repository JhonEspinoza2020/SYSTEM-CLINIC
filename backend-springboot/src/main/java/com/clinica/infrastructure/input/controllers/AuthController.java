package com.clinica.infrastructure.input.controllers;

import com.clinica.infrastructure.output.entities.UsuarioJpaEntity;
import com.clinica.infrastructure.output.repositories.UsuarioCrudRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.Random;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000") 
public class AuthController {

    private final UsuarioCrudRepository usuarioRepository;
    
    // Almacén temporal en memoria para los códigos
    private Map<String, String> codigosRecuperacion = new HashMap<>();

    public AuthController(UsuarioCrudRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String correo = credentials.get("correo");
        String password = credentials.get("password");

        System.out.println("\n===== 🕵️‍♂️ INTENTO DE LOGIN =====");
        Optional<UsuarioJpaEntity> usuarioOpt = usuarioRepository.findByCorreo(correo);

        if (usuarioOpt.isPresent()) {
            UsuarioJpaEntity usuario = usuarioOpt.get();
            if (usuario.getPassword().equals(password)) {
                System.out.println("✅ ¡Contraseña CORRECTA! Abriendo puertas...");
                usuario.setPassword(null);
                return ResponseEntity.ok(usuario);
            } else {
                System.out.println("❌ ERROR: La contraseña no coincide.");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Contraseña incorrecta");
            }
        }
        System.out.println("❌ ERROR: Ese correo NO EXISTE en MySQL.");
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Correo no encontrado");
    }

    @PostMapping("/registro")
    public ResponseEntity<?> registrarDoctor(@RequestBody UsuarioJpaEntity nuevoDoctor) {
        try {
            if (usuarioRepository.findByCorreo(nuevoDoctor.getCorreo()).isPresent()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("El correo ya está registrado.");
            }
            nuevoDoctor.setId(java.util.UUID.randomUUID().toString());
            nuevoDoctor.setUsername(nuevoDoctor.getCorreo());
            nuevoDoctor.setRol("DOCTOR");
            usuarioRepository.save(nuevoDoctor);
            nuevoDoctor.setPassword(null);
            return ResponseEntity.status(HttpStatus.CREATED).body(nuevoDoctor);
        } catch (Exception e) {
            e.printStackTrace(); 
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error interno al registrar");
        }
    }

    // ==========================================
    // RUTAS PARA RECUPERAR CONTRASEÑA
    // ==========================================

    @PostMapping("/recuperar")
    public ResponseEntity<?> solicitarCodigoRecuperacion(@RequestParam String correo) {
        Optional<UsuarioJpaEntity> usuarioOpt = usuarioRepository.findByCorreo(correo);
        
        if (!usuarioOpt.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "El correo no existe"));
        }

        String codigo = String.format("%06d", new Random().nextInt(999999));
        codigosRecuperacion.put(correo, codigo);

        System.out.println("\n=================================================");
        System.out.println("🔐 SOLICITUD DE RECUPERACIÓN DE NOVASALUD");
        System.out.println("📧 Correo: " + correo);
        System.out.println("👉 CÓDIGO SECRETO: " + codigo);
        System.out.println("=================================================\n");

        return ResponseEntity.ok().body(Map.of("mensaje", "Código generado con éxito"));
    }

    @PostMapping("/verificar-codigo")
    public ResponseEntity<?> verificarCodigo(@RequestBody Map<String, String> request) {
        String correo = request.get("correo");
        String codigo = request.get("codigo");
        String codigoGuardado = codigosRecuperacion.get(correo);

        if (codigoGuardado != null && codigoGuardado.equals(codigo)) {
            return ResponseEntity.ok().body(Map.of("mensaje", "Código válido"));
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Código inválido o expirado"));
    }

    @PutMapping("/nueva-password")
    public ResponseEntity<?> actualizarPasswordOlvidada(@RequestBody Map<String, String> request) {
        String correo = request.get("correo");
        String nuevaPassword = request.get("password");

        Optional<UsuarioJpaEntity> usuarioOpt = usuarioRepository.findByCorreo(correo);
        
        if (usuarioOpt.isPresent()) {
            UsuarioJpaEntity usuario = usuarioOpt.get();
            usuario.setPassword(nuevaPassword);
            usuarioRepository.save(usuario); // 🔥 AHORA SÍ SE GUARDA EN MYSQL 🔥
            codigosRecuperacion.remove(correo); // Borramos el código por seguridad
            return ResponseEntity.ok().body(Map.of("mensaje", "Contraseña actualizada exitosamente"));
        }
        
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Usuario no encontrado"));
    }
}