package com.clinica.infrastructure.input.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, String>> manejarRuntime(RuntimeException ex) {
        String mensaje = ex.getMessage() != null ? ex.getMessage() : "Error interno";
        HttpStatus status = mensaje.contains("no encontrado") || mensaje.contains("no existe")
                ? HttpStatus.NOT_FOUND
                : mensaje.contains("ya está registrado") || mensaje.contains("duplicado")
                ? HttpStatus.CONFLICT
                : mensaje.contains("incorrecta") || mensaje.contains("inválido") || mensaje.contains("Código")
                ? HttpStatus.UNAUTHORIZED
                : HttpStatus.BAD_REQUEST;
        return ResponseEntity.status(status).body(Map.of("error", mensaje, "message", mensaje));
    }
}
