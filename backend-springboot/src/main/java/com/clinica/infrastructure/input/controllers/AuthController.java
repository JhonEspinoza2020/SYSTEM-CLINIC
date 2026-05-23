package com.clinica.infrastructure.input.controllers;

import com.clinica.application.useCases.GestionarAuthUseCase;
import com.clinica.domain.entities.Usuario;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final GestionarAuthUseCase gestionarAuthUseCase;

    public AuthController(GestionarAuthUseCase gestionarAuthUseCase) {
        this.gestionarAuthUseCase = gestionarAuthUseCase;
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> credentials) {
        Map<String, Object> respuesta = gestionarAuthUseCase.iniciarSesion(
                credentials.get("correo"),
                credentials.get("password")
        );
        return ResponseEntity.ok(respuesta);
    }

    @PostMapping("/registro")
    public ResponseEntity<Usuario> registrarUsuario(@RequestBody Usuario nuevoUsuario) {
        Usuario creado = gestionarAuthUseCase.registrarUsuario(nuevoUsuario);
        return ResponseEntity.status(HttpStatus.CREATED).body(creado);
    }

    @PostMapping("/recuperar")
    public ResponseEntity<Map<String, String>> solicitarCodigoRecuperacion(@RequestParam String correo) {
        gestionarAuthUseCase.solicitarCodigoRecuperacion(correo);
        return ResponseEntity.ok(Map.of("mensaje", "Código generado y enviado con éxito"));
    }

    @PostMapping("/verificar-codigo")
    public ResponseEntity<Map<String, String>> verificarCodigo(@RequestBody Map<String, String> request) {
        gestionarAuthUseCase.verificarCodigo(request.get("correo"), request.get("codigo"));
        return ResponseEntity.ok(Map.of("mensaje", "Código válido"));
    }

    @PutMapping("/nueva-password")
    public ResponseEntity<Map<String, String>> actualizarPasswordOlvidada(@RequestBody Map<String, String> request) {
        gestionarAuthUseCase.actualizarPassword(request.get("correo"), request.get("password"));
        return ResponseEntity.ok(Map.of("mensaje", "Contraseña actualizada exitosamente"));
    }

    @PutMapping("/cambiar-password")
    public ResponseEntity<Map<String, String>> cambiarPassword(@RequestBody Map<String, String> request) {
        gestionarAuthUseCase.cambiarPasswordAutenticado(
                request.get("correo"),
                request.get("passwordActual"),
                request.get("passwordNueva")
        );
        return ResponseEntity.ok(Map.of("mensaje", "Contraseña actualizada exitosamente"));
    }

    @GetMapping("/doctores-activos")
    public ResponseEntity<List<Usuario>> obtenerDoctoresActivos() {
        return ResponseEntity.ok(gestionarAuthUseCase.listarDoctoresActivos());
    }

    @GetMapping("/usuarios")
    public ResponseEntity<List<Usuario>> obtenerTodosLosUsuarios() {
        return ResponseEntity.ok(gestionarAuthUseCase.listarTodosUsuarios());
    }

    @PutMapping("/usuarios/{id}/estado")
    public ResponseEntity<Usuario> cambiarEstadoUsuario(@PathVariable String id, @RequestBody Map<String, String> request) {
        return ResponseEntity.ok(gestionarAuthUseCase.cambiarEstadoUsuario(id, request.get("estado")));
    }

    @DeleteMapping("/usuarios/{id}")
    public ResponseEntity<Map<String, String>> eliminarUsuario(@PathVariable String id) {
        gestionarAuthUseCase.eliminarUsuario(id);
        return ResponseEntity.ok(Map.of("mensaje", "Usuario eliminado del sistema."));
    }
}
