package com.clinica.infrastructure.external;

import com.clinica.domain.entities.Paciente;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Component
public class IaRiskClient {

    private final RestTemplate restTemplate;
    private final String urlIa;

    public IaRiskClient(RestTemplate restTemplate, @Value("${app.ia.url}") String urlIa) {
        this.restTemplate = restTemplate;
        this.urlIa = urlIa;
    }

    public Optional<Map<String, String>> evaluarRiesgo(Paciente paciente) {
        try {
            Map<String, Object> request = new HashMap<>();
            request.put("edad", paciente.getEdad());
            request.put("tipo_sangre", paciente.getTipoSangre());
            request.put("alergias_conocidas",
                    paciente.getAlergiasConocidas() != null ? paciente.getAlergiasConocidas() : "Ninguna");
            request.put("peso_nacer", paciente.getPesoNacer());
            request.put("frecuencia_cardiaca", paciente.getFrecuenciaCardiaca());
            request.put("escala_glasgow", paciente.getEscalaGlasgow());
            request.put("temperatura", paciente.getTemperatura());
            request.put("nivel_dolor", paciente.getNivelDolor());

            ResponseEntity<Map> response = restTemplate.postForEntity(urlIa, request, Map.class);
            if (response.getBody() != null) {
                Map<String, String> resultado = new HashMap<>();
                resultado.put("riesgo_predicho", (String) response.getBody().get("riesgo_predicho"));
                resultado.put("recomendacion_ia", (String) response.getBody().get("recomendacion_ia"));
                return Optional.of(resultado);
            }
        } catch (Exception ignored) {
            // El servicio de aplicación decide el fallback
        }
        return Optional.empty();
    }
}
