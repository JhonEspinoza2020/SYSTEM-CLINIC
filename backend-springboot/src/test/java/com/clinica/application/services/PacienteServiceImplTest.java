package com.clinica.application.services;

import com.clinica.domain.entities.Paciente;
import com.clinica.domain.ports.PacienteRepositoryPort;
import com.clinica.infrastructure.external.IaRiskClient;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class PacienteServiceImplTest {

    @Mock
    private PacienteRepositoryPort pacienteRepositoryPort;

    @Mock
    private IaRiskClient iaRiskClient;

    @InjectMocks
    private PacienteServiceImpl pacienteService;

    private Paciente pacienteBase;

    @BeforeEach
    void setUp() {
        pacienteBase = Paciente.builder()
                .dni("12345678")
                .nombre("Juan")
                .edad(30)
                .tipoSangre("O+")
                .build();
    }

    @Test
    void registrarNuevoPaciente_rechazaDniDuplicado() {
        when(pacienteRepositoryPort.buscarPorDni("12345678")).thenReturn(Optional.of(pacienteBase));

        assertThrows(RuntimeException.class, () -> pacienteService.registrarNuevoPaciente(pacienteBase));
        verify(pacienteRepositoryPort, never()).guardar(any());
    }

    @Test
    void registrarNuevoPaciente_asignaRiesgoPendienteSiIaNoResponde() {
        when(pacienteRepositoryPort.buscarPorDni("12345678")).thenReturn(Optional.empty());
        when(iaRiskClient.evaluarRiesgo(any())).thenReturn(Optional.empty());
        when(pacienteRepositoryPort.guardar(any())).thenAnswer(inv -> inv.getArgument(0));

        Paciente resultado = pacienteService.registrarNuevoPaciente(pacienteBase);

        assertEquals("PENDIENTE", resultado.getRiesgoPredicho());
        verify(pacienteRepositoryPort).guardar(any());
    }
}
