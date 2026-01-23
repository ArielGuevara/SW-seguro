package ec.fin.coacandes.socios.dto.events;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.io.Serializable;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CuentaDestinoRequest implements Serializable {
    private String numeroCuenta;
}