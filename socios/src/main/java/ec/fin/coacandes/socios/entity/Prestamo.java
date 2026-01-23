package ec.fin.coacandes.socios.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "prestamos")
@Data
public class Prestamo {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(nullable = false)
    private UUID socioId;

    @Column(nullable = false)
    private BigDecimal monto;

    @Column(name = "cuenta_destino", nullable = false, length = 20)
    private String cuentaDestino; // El número de cuenta en NestJS

    @Column(nullable = false)
    private String estado; // "APROBADO", "RECHAZADO"

    @CreationTimestamp
    private LocalDateTime fechaCreacion;
}