package com.clinica.integration;

import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;

import java.util.Map;
import java.util.UUID;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class PacienteIntegrationTest extends AbstractIntegrationTest {

    @Test
    void doctorRegistraPaciente_conToken() throws Exception {
        DoctorTest doctor = registrarDoctorActivo();
        String tokenDoctor = loginYobtenerToken(doctor.correo(), "Password123!");

        mockMvc.perform(post("/api/pacientes")
                        .header("Authorization", "Bearer " + tokenDoctor)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.ofEntries(
                                Map.entry("id", UUID.randomUUID().toString()),
                                Map.entry("nombre", "Juan"),
                                Map.entry("apellidoPaterno", "Perez"),
                                Map.entry("apellidoMaterno", "Lopez"),
                                Map.entry("dni", UUID.randomUUID().toString().substring(0, 8)),
                                Map.entry("edad", 30),
                                Map.entry("tipoSangre", "O+"),
                                Map.entry("alergiasConocidas", "Ninguna"),
                                Map.entry("sexo", "M"),
                                Map.entry("numeroCama", 5),
                                Map.entry("historiaClinica", "HC-TEST-001"),
                                Map.entry("fechaRegistro", "2026-05-23 10:00:00"),
                                Map.entry("idDoctor", doctor.id()),
                                Map.entry("frecuenciaCardiaca", 72),
                                Map.entry("temperatura", 36.5)
                        ))))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.riesgoPredicho").value("BAJO"))
                .andExpect(jsonPath("$.dni").exists());
    }

    private DoctorTest registrarDoctorActivo() throws Exception {
        String correo = "doctor." + UUID.randomUUID().toString().substring(0, 8) + "@novasalud.com";
        var registro = mockMvc.perform(post("/api/auth/registro")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of(
                                "nombreCompleto", "Dr Test",
                                "correo", correo,
                                "password", "Password123!",
                                "dniDoctor", "11223344",
                                "especialidad", "Medicina General",
                                "rol", "DOCTOR"
                        ))))
                .andExpect(status().isCreated())
                .andReturn();

        String doctorId = objectMapper.readTree(registro.getResponse().getContentAsString()).get("id").asText();
        String tokenAdmin = loginYobtenerToken("admin@novasalud.com", "AdminNova2026!");

        mockMvc.perform(put("/api/auth/usuarios/" + doctorId + "/estado")
                        .header("Authorization", "Bearer " + tokenAdmin)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"estado\":\"ACTIVO\"}"))
                .andExpect(status().isOk());

        return new DoctorTest(doctorId, correo);
    }

    private record DoctorTest(String id, String correo) {}
}
