package ec.fin.coacandes.socios.service.impl;


import ec.fin.coacandes.socios.entity.Prestamo;
import ec.fin.coacandes.socios.repository.PrestamoRepository;
import ec.fin.coacandes.socios.service.integration.CuentaIntegrationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class PrestamoServiceImpl {

    private final PrestamoRepository prestamoRepository;
    private final CuentaIntegrationService cuentaIntegrationService;

    @Transactional
    public Prestamo crearPrestamo(Prestamo prestamo) {
        // 1. Validar Cuenta Destino via RabbitMQ
        boolean cuentaValida = cuentaIntegrationService.validarCuentaDestino(prestamo.getCuentaDestino());

        if (!cuentaValida) {
            throw new IllegalArgumentException("La cuenta destino no existe o no está activa. Préstamo rechazado.");
        }

        // 2. Si es válida, aprobamos y guardamos
        prestamo.setEstado("APROBADO");
        return prestamoRepository.save(prestamo);
    }
}