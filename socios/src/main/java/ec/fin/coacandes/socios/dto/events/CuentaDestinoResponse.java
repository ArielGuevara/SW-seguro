package ec.fin.coacandes.socios.dto.events;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.io.Serializable;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CuentaDestinoResponse implements Serializable {
    private boolean valida; // Existe y está activa
    private String mensaje;
}