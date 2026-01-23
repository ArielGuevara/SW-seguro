package ec.fin.coacandes.socios.dto.events;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.io.Serializable;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CuentaValidacionResponse implements Serializable {
    private boolean tieneCuentasActivas;
    private String mensaje;
}