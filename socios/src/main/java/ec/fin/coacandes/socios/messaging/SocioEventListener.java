package ec.fin.coacandes.socios.messaging;

import ec.fin.coacandes.socios.dto.events.SocioValidacionRequest;
import ec.fin.coacandes.socios.dto.events.SocioValidacionResponse;
import ec.fin.coacandes.socios.entity.Socio;
import ec.fin.coacandes.socios.repository.SocioRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.Exchange;
import org.springframework.amqp.rabbit.annotation.Queue;
import org.springframework.amqp.rabbit.annotation.QueueBinding;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

import java.util.Optional;
import java.util.UUID;

@Component
@Slf4j
@RequiredArgsConstructor
public class SocioEventListener {

    private final SocioRepository socioRepository;

    // ========================================
    // Listener 1: Validación de Socio (Responde a NestJS)
    // ========================================
    @RabbitListener(bindings = @QueueBinding(
            value = @Queue(value = "${custom.rabbitmq.queue.socio-validacion}", durable = "true"),
            exchange = @Exchange(value = "${custom.rabbitmq.exchange}", type = "topic"),
            key = "${custom.rabbitmq.routing-key.socio-validacion}"
    ))
    public SocioValidacionResponse handleValidacionSocio(SocioValidacionRequest request) {
        log.info("Validando socio con ID: {}", request.getIdentificacion());

        // CAMBIO: Usamos UUID.fromString porque el request envía el ID como String
        try {
            UUID idSocio = UUID.fromString(request.getIdentificacion());
            Optional<Socio> socioOpt = socioRepository.findById(idSocio);

            if (socioOpt.isPresent()) {
                Socio socio = socioOpt.get();
                return SocioValidacionResponse.builder()
                        .existe(true)
                        .activo(socio.getActivo())
                        .socioId(socio.getId())
                        .nombreCompleto(socio.getNombres() + " " + socio.getApellidos())
                        .mensaje("Socio válido")
                        .build();
            }
        } catch (IllegalArgumentException e) {
            log.error("ID de formato inválido: {}", request.getIdentificacion());
        }

        return SocioValidacionResponse.builder()
                .existe(false)
                .activo(false)
                .mensaje("Socio no encontrado o ID inválido")
                .build();
    }
}
