package com.clinica.integration;

import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;

import java.util.Map;
import java.util.UUID;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class CitaIntegrationTest extends AbstractIntegrationTest {

    @Test
    void pacienteSolicitaCita_yDoctorLaVe() throws Exception {
        DoctorTest doctor = registrarDoctorActivo();
        String pacienteId = registrarPacienteActivo();
        String tokenPaciente = loginYobtenerToken("paciente.cita@novasalud.com", "Password123!");

        mockMvc.perform(post("/api/citas")
                        .header("Authorization", "Bearer " + tokenPaciente)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of(
                                "pacienteId", pacienteId,
                                "doctorId", doctor.id(),
                                "nombrePaciente", "Paciente Cita",
                                "nombreDoctor", "Dr Test",
                                "especialidad", "Medicina General",
                                "fecha", "2026-06-01",
                                "hora", "10:00",
                                "motivo", "Consulta general de control"
                        ))))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.estado").value("PENDIENTE"));

        String tokenDoctor = loginYobtenerToken(doctor.correo(), "Password123!");
        mockMvc.perform(get("/api/citas/doctor/" + doctor.id())
                        .header("Authorization", "Bearer " + tokenDoctor))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].motivo").value("Consulta general de control"));
    }

    private DoctorTest registrarDoctorActivo() throws Exception {
        String correo = "doctor.cita." + UUID.randomUUID().toString().substring(0, 6) + "@novasalud.com";
        var registro = mockMvc.perform(post("/api/auth/registro")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of(
                                "nombreCompleto", "Dr Cita",
                                "correo", correo,
                                "password", "Password123!",
                                "dniDoctor", "99887766",
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

    private String registrarPacienteActivo() throws Exception {
        var registro = mockMvc.perform(post("/api/auth/registro")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of(
                                "nombreCompleto", "Paciente Cita",
                                "correo", "paciente.cita@novasalud.com",
                                "password", "Password123!",
                                "dniDoctor", "87654321",
                                "rol", "PACIENTE"
                        ))))
                .andExpect(status().isCreated())
                .andReturn();
        return objectMapper.readTree(registro.getResponse().getContentAsString()).get("id").asText();
    }

    private record DoctorTest(String id, String correo) {}
}
