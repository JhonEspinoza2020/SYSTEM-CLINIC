package com.clinica.infrastructure.external;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class WebSocketNotificationService {

    private final SimpMessagingTemplate messagingTemplate;

    public WebSocketNotificationService(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    public void notificarDoctor(String doctorId, String mensaje) {
        messagingTemplate.convertAndSend(
                "/topic/notificaciones/" + doctorId,
                Map.of("mensaje", mensaje)
        );
    }
}
