package ec.fin.coacandes.socios.service.integration;


import com.fasterxml.jackson.databind.ObjectMapper;
import ec.fin.coacandes.socios.dto.events.CuentaDestinoRequest;
import ec.fin.coacandes.socios.dto.events.CuentaDestinoResponse;
import ec.fin.coacandes.socios.dto.events.CuentaValidacionRequest;
import ec.fin.coacandes.socios.dto.events.CuentaValidacionResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class CuentaIntegrationService {

    private final RabbitTemplate rabbitTemplate;
    // 1. Inyectamos el ObjectMapper para hacer la conversión manual
    private final ObjectMapper objectMapper;

    @Value("${custom.rabbitmq.exchange}")
    private String exchange;

    @Value("${custom.rabbitmq.routing-key.validar-cuentas}")
    private String routingKeyValidacion; // Ajusté el nombre para diferenciarlo

    @Value("${custom.rabbitmq.routing-key.validar-prestamo}")
    private String routingKeyPrestamo;

    // --- Lógica de Eliminación de Socio ---
    public boolean tieneCuentasActivas(UUID socioId) {
        log.info("Consultando a MS Cuentas si el socio {} tiene cuentas activas...", socioId);

        CuentaValidacionRequest request = CuentaValidacionRequest.builder()
                .socioId(socioId)
                .build();

        Object responseObj = rabbitTemplate.convertSendAndReceive(exchange, routingKeyValidacion, request);

        // Corrección de conversión
        if (responseObj != null) {
            try {
                CuentaValidacionResponse response = objectMapper.convertValue(responseObj, CuentaValidacionResponse.class);
                log.info("Respuesta recibida (Socio): {}", response.getMensaje());
                return response.isTieneCuentasActivas();
            } catch (Exception e) {
                log.error("Error al convertir respuesta de validación de socio", e);
            }
        }

        log.error("No se recibió respuesta válida del servicio de Cuentas.");
        return true;
    }

    // --- Lógica de Préstamo (Aquí estaba el fallo) ---
    public boolean validarCuentaDestino(String numeroCuenta) {
        log.info("Validando cuenta destino {} en MS Cuentas...", numeroCuenta);

        CuentaDestinoRequest request = CuentaDestinoRequest.builder()
                .numeroCuenta(numeroCuenta)
                .build();

        Object responseObj = rabbitTemplate.convertSendAndReceive(exchange, routingKeyPrestamo, request);

        if (responseObj != null) {
            try {
                // NestJS nos devuelve un Map, Jackson lo convierte a nuestro objeto Java
                CuentaDestinoResponse response = objectMapper.convertValue(responseObj, CuentaDestinoResponse.class);

                log.info("Respuesta recibida (Préstamo): Valida={}, Mensaje={}", response.isValida(), response.getMensaje());
                return response.isValida();
            } catch (IllegalArgumentException e) {
                log.error("Error al convertir la respuesta JSON de NestJS a Objeto Java: {}", e.getMessage());
            }
        }

        log.error("Sin respuesta del servicio de Cuentas para validación de préstamo.");
        return false;
    }
}