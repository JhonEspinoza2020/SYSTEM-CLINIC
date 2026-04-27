package com.clinica.infrastructure.input.controllers;

import com.clinica.infrastructure.output.entities.UsuarioJpaEntity;
import com.clinica.infrastructure.output.repositories.UsuarioCrudRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.Random;
import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000") 
public class AuthController {

    private final UsuarioCrudRepository usuarioRepository;
    private final JavaMailSender mailSender; // 🚀 El servicio de envío de correos
    private Map<String, String> codigosRecuperacion = new HashMap<>();

    public AuthController(UsuarioCrudRepository usuarioRepository, JavaMailSender mailSender) {
        this.usuarioRepository = usuarioRepository;
        this.mailSender = mailSender;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String correo = credentials.get("correo");
        String password = credentials.get("password");

        System.out.println("\n===== 🕵️‍♂️ INTENTO DE LOGIN UNIVERSAL =====");
        Optional<UsuarioJpaEntity> usuarioOpt = usuarioRepository.findByCorreo(correo);

        if (usuarioOpt.isPresent()) {
            UsuarioJpaEntity usuario = usuarioOpt.get();
            if (usuario.getPassword().equals(password)) {
                
                if ("DOCTOR".equals(usuario.getRol()) && !"ACTIVO".equals(usuario.getEstado())) {
                    System.out.println("❌ ERROR: Cuenta inactiva.");
                    return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", "Su cuenta aún no ha sido activada por el administrador."));
                }

                System.out.println("✅ ¡Acceso Autorizado! Rol: " + usuario.getRol());
                usuario.setPassword(null);
                return ResponseEntity.ok(usuario);
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Contraseña incorrecta"));
            }
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Correo no encontrado"));
    }

    @PostMapping("/registro")
    public ResponseEntity<?> registrarUsuario(@RequestBody UsuarioJpaEntity nuevoUsuario) {
        try {
            if (usuarioRepository.findByCorreo(nuevoUsuario.getCorreo()).isPresent()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("El correo ya está registrado.");
            }
            nuevoUsuario.setId(UUID.randomUUID().toString());
            nuevoUsuario.setUsername(nuevoUsuario.getCorreo());
            
            if ("PACIENTE".equals(nuevoUsuario.getRol())) {
                nuevoUsuario.setEstado("ACTIVO"); 
            } else {
                nuevoUsuario.setRol("DOCTOR"); 
                nuevoUsuario.setEstado("PENDIENTE"); 
            }
            
            usuarioRepository.save(nuevoUsuario);
            nuevoUsuario.setPassword(null);
            return ResponseEntity.status(HttpStatus.CREATED).body(nuevoUsuario);
        } catch (Exception e) {
            e.printStackTrace(); 
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error interno al registrar");
        }
    }

    // ==========================================
    // 🚀 LÓGICA DE RECUPERACIÓN CON CORREO REAL
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
        System.out.println("📧 Correo Destino: " + correo);
        System.out.println("👉 CÓDIGO SECRETO: " + codigo);
        System.out.println("=================================================\n");
        
        // 🚀 ENVÍO DEL CORREO ELECTRÓNICO
        try {
            SimpleMailMessage mensaje = new SimpleMailMessage();
            mensaje.setFrom("espinozajhon739@gmail.com"); 
            mensaje.setTo(correo); 
            mensaje.setSubject("NovaSalud - Código de Recuperación de Acceso");
            mensaje.setText("Hola,\n\nHemos recibido una solicitud para recuperar el acceso a tu cuenta en NovaSalud.\n\n"
                    + "Tu código seguro de 6 dígitos es: " + codigo + "\n\n"
                    + "Ingresa este código en la plataforma para establecer una nueva contraseña. "
                    + "Si no solicitaste este código, puedes ignorar este mensaje de forma segura.\n\n"
                    + "Atentamente,\nEl equipo de seguridad de NovaSalud.");
            
            mailSender.send(mensaje);
            System.out.println("✅ Correo enviado exitosamente a " + correo);
            
        } catch (Exception e) {
            System.out.println("❌ ERROR AL ENVIAR CORREO: Verifica tu configuración en application.properties");
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "Error al enviar el correo. Intente más tarde."));
        }
        
        return ResponseEntity.ok().body(Map.of("mensaje", "Código generado y enviado con éxito"));
    }

    @PostMapping("/verificar-codigo")
    public ResponseEntity<?> verificarCodigo(@RequestBody Map<String, String> request) {
        String correo = request.get("correo");
        String codigo = request.get("codigo");
        if (codigo.equals(codigosRecuperacion.get(correo))) {
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
            usuarioRepository.save(usuario); 
            codigosRecuperacion.remove(correo); 
            return ResponseEntity.ok().body(Map.of("mensaje", "Contraseña actualizada exitosamente"));
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Usuario no encontrado"));
    }

    @GetMapping("/doctores-activos")
    public ResponseEntity<?> obtenerDoctoresActivos() {
        java.util.List<UsuarioJpaEntity> doctores = usuarioRepository.findAll().stream()
                .filter(u -> "DOCTOR".equals(u.getRol()) && "ACTIVO".equals(u.getEstado()))
                .toList();
        doctores.forEach(d -> d.setPassword(null));
        return ResponseEntity.ok(doctores);
    }

    @GetMapping("/usuarios")
    public ResponseEntity<?> obtenerTodosLosUsuarios() {
        java.util.List<UsuarioJpaEntity> usuarios = usuarioRepository.findAll();
        usuarios.forEach(u -> u.setPassword(null));
        return ResponseEntity.ok(usuarios);
    }

    @PutMapping("/usuarios/{id}/estado")
    public ResponseEntity<?> cambiarEstadoUsuario(@PathVariable String id, @RequestBody Map<String, String> request) {
        Optional<UsuarioJpaEntity> usuarioOpt = usuarioRepository.findById(id);
        if (usuarioOpt.isPresent()) {
            UsuarioJpaEntity usuario = usuarioOpt.get();
            usuario.setEstado(request.get("estado")); 
            usuarioRepository.save(usuario);
            return ResponseEntity.ok(Map.of("mensaje", "Estado actualizado correctamente"));
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Usuario no encontrado"));
    }

    @DeleteMapping("/usuarios/{id}")
    public ResponseEntity<?> eliminarUsuario(@PathVariable String id) {
        if (usuarioRepository.existsById(id)) {
            usuarioRepository.deleteById(id);
            return ResponseEntity.ok(Map.of("mensaje", "Usuario eliminado del sistema."));
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "No encontrado"));
    }
}