package ec.fin.coacandes.socios;

import com.fasterxml.jackson.databind.ObjectMapper;
import ec.fin.coacandes.socios.dto.SocioRequestDTO;
import ec.fin.coacandes.socios.dto.SocioResponseDTO;
import ec.fin.coacandes.socios.dto.events.CuentaDestinoRequest;
import ec.fin.coacandes.socios.dto.events.CuentaDestinoResponse;
import ec.fin.coacandes.socios.dto.events.CuentaValidacionRequest;
import ec.fin.coacandes.socios.dto.events.CuentaValidacionResponse;
import ec.fin.coacandes.socios.entity.Prestamo;
import ec.fin.coacandes.socios.entity.Socio;
import ec.fin.coacandes.socios.repository.PrestamoRepository;
import ec.fin.coacandes.socios.repository.SocioRepository;
import ec.fin.coacandes.socios.service.impl.PrestamoServiceImpl;
import ec.fin.coacandes.socios.service.impl.SocioServiceImpl;
import ec.fin.coacandes.socios.service.integration.CuentaIntegrationService;
import ec.fin.coacandes.socios.controller.SocioController;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.modelmapper.ModelMapper;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@SpringBootTest
class SociosApplicationTests {

    @Test
    void contextLoads() {
    }

    // ========== TESTS PARA CuentaIntegrationService ==========
    @Nested
    @DisplayName("Tests para CuentaIntegrationService")
    @ExtendWith(MockitoExtension.class)
    class CuentaIntegrationServiceTests {

        @Mock
        private RabbitTemplate rabbitTemplate;

        @Mock
        private ObjectMapper objectMapper;

        @InjectMocks
        private CuentaIntegrationService cuentaIntegrationService;

        private UUID socioId;

        @BeforeEach
        void setUp() {
            socioId = UUID.randomUUID();
        }

        @Test
        @DisplayName("Debería retornar true cuando socio tiene cuentas activas")
        void deberiaRetornarTrueCuandoSocioTieneCuentasActivas() {
            // Arrange
            CuentaValidacionResponse response = new CuentaValidacionResponse();
            response.setTieneCuentasActivas(true);
            response.setMensaje("Tiene cuentas activas");

            Object mockResponse = new Object();
            when(rabbitTemplate.convertSendAndReceive(
                isNull(), 
                isNull(), 
                any(CuentaValidacionRequest.class)
            )).thenReturn(mockResponse);
            
            when(objectMapper.convertValue(mockResponse, CuentaValidacionResponse.class))
                .thenReturn(response);

            // Act
            boolean resultado = cuentaIntegrationService.tieneCuentasActivas(socioId);

            // Assert
            assertTrue(resultado);
            verify(rabbitTemplate, times(1)).convertSendAndReceive(
                isNull(), 
                isNull(), 
                any(CuentaValidacionRequest.class)
            );
        }

        @Test
        @DisplayName("Debería retornar false cuando socio no tiene cuentas activas")
        void deberiaRetornarFalseCuandoSocioNoTieneCuentasActivas() {
            // Arrange
            CuentaValidacionResponse response = new CuentaValidacionResponse();
            response.setTieneCuentasActivas(false);
            response.setMensaje("No tiene cuentas activas");

            Object mockResponse = new Object();
            when(rabbitTemplate.convertSendAndReceive(
                isNull(), 
                isNull(), 
                any(CuentaValidacionRequest.class)
            )).thenReturn(mockResponse);
            
            when(objectMapper.convertValue(mockResponse, CuentaValidacionResponse.class))
                .thenReturn(response);

            // Act
            boolean resultado = cuentaIntegrationService.tieneCuentasActivas(socioId);

            // Assert
            assertFalse(resultado);
            verify(rabbitTemplate, times(1)).convertSendAndReceive(
                isNull(), 
                isNull(), 
                any(CuentaValidacionRequest.class)
            );
        }

        @Test
        @DisplayName("Debería retornar true cuando no se recibe respuesta del servicio")
        void deberiaRetornarTrueCuandoNoSeRecibeRespuesta() {
            // Arrange
            when(rabbitTemplate.convertSendAndReceive(
                isNull(), 
                isNull(), 
                any(CuentaValidacionRequest.class)
            )).thenReturn(null);

            // Act
            boolean resultado = cuentaIntegrationService.tieneCuentasActivas(socioId);

            // Assert
            assertTrue(resultado);
            verify(rabbitTemplate, times(1)).convertSendAndReceive(
                isNull(), 
                isNull(), 
                any(CuentaValidacionRequest.class)
            );
        }

        @Test
        @DisplayName("Debería retornar true cuando hay error al convertir respuesta")
        void deberiaRetornarTrueCuandoHayErrorAlConvertir() {
            // Arrange
            Object mockResponse = new Object();
            when(rabbitTemplate.convertSendAndReceive(
                isNull(), 
                isNull(), 
                any(CuentaValidacionRequest.class)
            )).thenReturn(mockResponse);
            
            when(objectMapper.convertValue(mockResponse, CuentaValidacionResponse.class))
                .thenThrow(new IllegalArgumentException("Error de conversión"));

            // Act
            boolean resultado = cuentaIntegrationService.tieneCuentasActivas(socioId);

            // Assert
            assertTrue(resultado);
            verify(rabbitTemplate, times(1)).convertSendAndReceive(
                isNull(), 
                isNull(), 
                any(CuentaValidacionRequest.class)
            );
        }

        @Test
        @DisplayName("Debería validar cuenta destino correctamente cuando es válida")
        void deberiaValidarCuentaDestinoCorrectamenteCuandoEsValida() {
            // Arrange
            String numeroCuenta = "1234567890";
            CuentaDestinoResponse response = new CuentaDestinoResponse();
            response.setValida(true);
            response.setMensaje("Cuenta válida");

            Object mockResponse = new Object();
            when(rabbitTemplate.convertSendAndReceive(
                isNull(), 
                isNull(), 
                any(CuentaDestinoRequest.class)
            )).thenReturn(mockResponse);
            
            when(objectMapper.convertValue(mockResponse, CuentaDestinoResponse.class))
                .thenReturn(response);

            // Act
            boolean resultado = cuentaIntegrationService.validarCuentaDestino(numeroCuenta);

            // Assert
            assertTrue(resultado);
            verify(rabbitTemplate, times(1)).convertSendAndReceive(
                isNull(), 
                isNull(), 
                any(CuentaDestinoRequest.class)
            );
        }

        @Test
        @DisplayName("Debería retornar false cuando cuenta destino no es válida")
        void deberiaRetornarFalseCuandoCuentaDestinoNoEsValida() {
            // Arrange
            String numeroCuenta = "0000000000";
            CuentaDestinoResponse response = new CuentaDestinoResponse();
            response.setValida(false);
            response.setMensaje("Cuenta inválida");

            Object mockResponse = new Object();
            when(rabbitTemplate.convertSendAndReceive(
                isNull(), 
                isNull(), 
                any(CuentaDestinoRequest.class)
            )).thenReturn(mockResponse);
            
            when(objectMapper.convertValue(mockResponse, CuentaDestinoResponse.class))
                .thenReturn(response);

            // Act
            boolean resultado = cuentaIntegrationService.validarCuentaDestino(numeroCuenta);

            // Assert
            assertFalse(resultado);
            verify(rabbitTemplate, times(1)).convertSendAndReceive(
                isNull(), 
                isNull(), 
                any(CuentaDestinoRequest.class)
            );
        }

        @Test
        @DisplayName("Debería retornar false cuando no hay respuesta del servicio de cuentas")
        void deberiaRetornarFalseCuandoNoHayRespuestaDelServicio() {
            // Arrange
            when(rabbitTemplate.convertSendAndReceive(
                isNull(), 
                isNull(), 
                any(CuentaDestinoRequest.class)
            )).thenReturn(null);

            // Act
            boolean resultado = cuentaIntegrationService.validarCuentaDestino("1234567890");

            // Assert
            assertFalse(resultado);
            verify(rabbitTemplate, times(1)).convertSendAndReceive(
                isNull(), 
                isNull(), 
                any(CuentaDestinoRequest.class)
            );
        }
    }
}