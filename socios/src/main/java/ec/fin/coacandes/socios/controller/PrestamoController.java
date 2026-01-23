package ec.fin.coacandes.socios.controller;

import ec.fin.coacandes.socios.entity.Prestamo;
import ec.fin.coacandes.socios.service.impl.PrestamoServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/prestamos")
@RequiredArgsConstructor
public class PrestamoController {

    private final PrestamoServiceImpl prestamoService;

    @PostMapping
    public ResponseEntity<Prestamo> solicitarPrestamo(@RequestBody Prestamo prestamo) {
        Prestamo nuevoPrestamo = prestamoService.crearPrestamo(prestamo);
        return ResponseEntity.ok(nuevoPrestamo);
    }
}