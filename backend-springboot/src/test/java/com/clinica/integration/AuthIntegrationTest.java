package com.clinica.integration;

import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;

import java.util.Map;
import java.util.UUID;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class AuthIntegrationTest extends AbstractIntegrationTest {

    @Test
    void loginAdmin_devuelveToken() throws Exception {
        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of(
                                "correo", "admin@novasalud.com",
                                "password", "AdminNova2026!"
                        ))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").isNotEmpty())
                .andExpect(jsonPath("$.usuario.rol").value("ADMIN"));
    }

    @Test
    void loginConPasswordIncorrecta_devuelve401() throws Exception {
        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of(
                                "correo", "admin@novasalud.com",
                                "password", "mal"
                        ))))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void registroPaciente_exitoso() throws Exception {
        String correo = "paciente." + UUID.randomUUID().toString().substring(0, 8) + "@novasalud.com";
        mockMvc.perform(post("/api/auth/registro")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of(
                                "nombreCompleto", "Paciente Test",
                                "correo", correo,
                                "password", "Password123!",
                                "dniDoctor", "87654321",
                                "rol", "PACIENTE"
                        ))))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.rol").value("PACIENTE"))
                .andExpect(jsonPath("$.estado").value("ACTIVO"));
    }
}
