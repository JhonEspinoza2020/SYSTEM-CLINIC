package com.clinica.application.services;

import com.clinica.application.useCases.GestionarAuthUseCase;
import com.clinica.domain.entities.Usuario;
import com.clinica.domain.ports.UsuarioRepositoryPort;
import com.clinica.infrastructure.external.OtpRecoveryService;
import com.clinica.infrastructure.security.JwtUtil;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class AuthServiceImpl implements GestionarAuthUseCase {

    private final UsuarioRepositoryPort usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final OtpRecoveryService otpRecoveryService;
    private final JavaMailSender mailSender;

    @Value("${spring.mail.username:}")
    private String mailFrom;

    public AuthServiceImpl(
            UsuarioRepositoryPort usuarioRepository,
            PasswordEncoder passwordEncoder,
            JwtUtil jwtUtil,
            OtpRecoveryService otpRecoveryService,
            JavaMailSender mailSender) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.otpRecoveryService = otpRecoveryService;
        this.mailSender = mailSender;
    }

    @Override
    public Map<String, Object> iniciarSesion(String correo, String password) {
        Usuario usuario = usuarioRepository.buscarPorCorreo(correo)
                .orElseThrow(() -> new RuntimeException("Correo no encontrado"));

        if (!verificarPassword(password, usuario.getPassword())) {
            throw new RuntimeException("Contraseña incorrecta");
        }

        migrarPasswordSiEsPlano(usuario, password);

        if ("DOCTOR".equals(usuario.getRol()) && !"ACTIVO".equals(usuario.getEstado())) {
            throw new RuntimeException("Su cuenta aún no ha sido activada por el administrador.");
        }

        String token = jwtUtil.generarToken(usuario.getId(), usuario.getCorreo(), usuario.getRol());
        Map<String, Object> respuesta = new HashMap<>();
        respuesta.put("token", token);
        respuesta.put("usuario", sinPassword(usuario));
        return respuesta;
    }

    @Override
    public Usuario registrarUsuario(Usuario nuevoUsuario) {
        if (usuarioRepository.buscarPorCorreo(nuevoUsuario.getCorreo()).isPresent()) {
            throw new RuntimeException("El correo ya está registrado.");
        }
        nuevoUsuario.setId(UUID.randomUUID().toString());
        nuevoUsuario.setUsername(nuevoUsuario.getCorreo());
        nuevoUsuario.setPassword(passwordEncoder.encode(nuevoUsuario.getPassword()));

        if ("PACIENTE".equals(nuevoUsuario.getRol())) {
            nuevoUsuario.setEstado("ACTIVO");
        } else {
            nuevoUsuario.setRol("DOCTOR");
            nuevoUsuario.setEstado("PENDIENTE");
        }

        return sinPassword(usuarioRepository.guardar(nuevoUsuario));
    }

    @Override
    public void solicitarCodigoRecuperacion(String correo) {
        Usuario usuario = usuarioRepository.buscarPorCorreo(correo)
                .orElseThrow(() -> new RuntimeException("El correo no existe"));
        String codigo = otpRecoveryService.generarCodigo(correo);

        if (mailFrom != null && !mailFrom.isBlank()) {
            SimpleMailMessage mensaje = new SimpleMailMessage();
            mensaje.setFrom(mailFrom);
            mensaje.setTo(usuario.getCorreo());
            mensaje.setSubject("NovaSalud - Código de Recuperación de Acceso");
            mensaje.setText("Tu código seguro de 6 dígitos es: " + codigo
                    + "\n\nExpira en 15 minutos. Si no solicitaste este código, ignora este mensaje.");
            mailSender.send(mensaje);
        }
    }

    @Override
    public void verificarCodigo(String correo, String codigo) {
        if (!otpRecoveryService.verificar(correo, codigo)) {
            throw new RuntimeException("Código inválido o expirado");
        }
    }

    @Override
    public void cambiarPasswordAutenticado(String correo, String passwordActual, String nuevaPassword) {
        Usuario usuario = usuarioRepository.buscarPorCorreo(correo)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        if (!verificarPassword(passwordActual, usuario.getPassword())) {
            throw new RuntimeException("Contraseña actual incorrecta");
        }
        migrarPasswordSiEsPlano(usuario, passwordActual);
        usuario.setPassword(passwordEncoder.encode(nuevaPassword));
        usuarioRepository.guardar(usuario);
    }

    @Override
    public void actualizarPassword(String correo, String nuevaPassword) {
        if (!otpRecoveryService.estaVerificado(correo)) {
            throw new RuntimeException("Debe verificar el código OTP antes de cambiar la contraseña");
        }
        Usuario usuario = usuarioRepository.buscarPorCorreo(correo)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        usuario.setPassword(passwordEncoder.encode(nuevaPassword));
        usuarioRepository.guardar(usuario);
        otpRecoveryService.invalidar(correo);
    }

    @Override
    public List<Usuario> listarDoctoresActivos() {
        return usuarioRepository.listarTodos().stream()
                .filter(u -> "DOCTOR".equals(u.getRol()) && "ACTIVO".equals(u.getEstado()))
                .map(this::sinPassword)
                .collect(Collectors.toList());
    }

    @Override
    public List<Usuario> listarTodosUsuarios() {
        return usuarioRepository.listarTodos().stream()
                .map(this::sinPassword)
                .collect(Collectors.toList());
    }

    @Override
    public Usuario cambiarEstadoUsuario(String id, String estado) {
        Usuario usuario = usuarioRepository.buscarPorId(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        usuario.setEstado(estado);
        return sinPassword(usuarioRepository.guardar(usuario));
    }

    @Override
    public void eliminarUsuario(String id) {
        if (!usuarioRepository.existePorId(id)) {
            throw new RuntimeException("Usuario no encontrado");
        }
        usuarioRepository.eliminar(id);
    }

    private boolean verificarPassword(String raw, String stored) {
        if (stored != null && passwordEncoder.matches(raw, stored)) {
            return true;
        }
        // Migración de contraseñas en texto plano existentes
        if (stored != null && stored.equals(raw)) {
            return true;
        }
        return false;
    }

    private void migrarPasswordSiEsPlano(Usuario usuario, String rawPassword) {
        String stored = usuario.getPassword();
        if (stored != null && stored.equals(rawPassword) && !stored.startsWith("$2a$")) {
            usuario.setPassword(passwordEncoder.encode(rawPassword));
            usuarioRepository.guardar(usuario);
        }
    }

    private Usuario sinPassword(Usuario u) {
        u.setPassword(null);
        return u;
    }
}
