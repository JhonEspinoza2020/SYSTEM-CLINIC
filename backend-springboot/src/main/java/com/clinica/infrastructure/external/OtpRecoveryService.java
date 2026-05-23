package com.clinica.infrastructure.external;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class OtpRecoveryService {

    private final Map<String, OtpEntry> codigos = new ConcurrentHashMap<>();
    private final long expirationMinutes;

    public OtpRecoveryService(@Value("${app.otp.expiration-minutes}") long expirationMinutes) {
        this.expirationMinutes = expirationMinutes;
    }

    public String generarCodigo(String correo) {
        String codigo = String.format("%06d", new Random().nextInt(999999));
        codigos.put(correo, new OtpEntry(codigo, Instant.now().plusSeconds(expirationMinutes * 60)));
        return codigo;
    }

    public boolean verificar(String correo, String codigo) {
        OtpEntry entry = codigos.get(correo);
        if (entry == null) return false;
        if (Instant.now().isAfter(entry.expiraEn())) {
            codigos.remove(correo);
            return false;
        }
        if (entry.codigo().equals(codigo)) {
            codigos.put(correo, new OtpEntry(codigo, entry.expiraEn(), true));
            return true;
        }
        return false;
    }

    public boolean estaVerificado(String correo) {
        OtpEntry entry = codigos.get(correo);
        return entry != null && entry.verificado() && Instant.now().isBefore(entry.expiraEn());
    }

    public void invalidar(String correo) {
        codigos.remove(correo);
    }

    private record OtpEntry(String codigo, Instant expiraEn, boolean verificado) {
        OtpEntry(String codigo, Instant expiraEn) {
            this(codigo, expiraEn, false);
        }
    }
}
