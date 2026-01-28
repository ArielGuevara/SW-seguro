import { Link, useParams } from "react-router";
import { useAccountsByPartner } from "../hooks/useAccountsByPartner";

export function Partner() {
  const { partnerId } = useParams();
  const { accounts } = useAccountsByPartner({ id: partnerId });

  return (
    <main>
      <section style={{ marginTop: "2rem" }}>
        <h2>Cuentas</h2>

        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Link to={"/"} data-cy="partners-link">
            Ver socios
          </Link>
          <Link
            to={`/partner/${partnerId}/account`}
            data-cy="account-register-link"
          >
            Crear cuenta
          </Link>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>N° Cuenta</th>
              <th>Tipo</th>
              <th>Estado</th>
              <th>Saldo</th>
              <th>Creada</th>
              <th>Actualizada</th>
            </tr>
          </thead>

          <tbody>
            {accounts?.map((account) => (
              <tr key={account.numeroCuenta}>
                <td data-cy="account-numeroCuenta">{account.numeroCuenta}</td>
                <td data-cy="account-tipoCuenta">{account.tipoCuenta}</td>
                <td data-cy="account-estado">{account.estado}</td>
                <td data-cy="account-saldo">
                  {account.saldo.toLocaleString("es-EC", {
                    style: "currency",
                    currency: "USD",
                  })}
                </td>
                <td data-cy="account-fechaCreacion">
                  {new Date(account.fechaCreacion).toLocaleDateString()}
                </td>
                <td data-cy="account-fechaActualizacion">
                  {new Date(account.fechaActualizacion).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {accounts?.length === 0 && (
          <p data-cy="accounts-placeholder">No hay cuentas registradas</p>
        )}
      </section>
    </main>
  );
}
