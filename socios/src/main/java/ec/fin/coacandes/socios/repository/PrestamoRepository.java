package ec.fin.coacandes.socios.repository;

import ec.fin.coacandes.socios.entity.Prestamo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface PrestamoRepository extends JpaRepository<Prestamo, UUID> {
}
