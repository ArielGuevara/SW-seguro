import { Link, Navigate, useParams } from "react-router";
import { useAccountsByPartner } from "../hooks/useAccountsByPartner";

export function Partner() {
  const { partnerId } = useParams();
  const { accounts } = useAccountsByPartner({ id: partnerId });

  if (!partnerId) {
    return <Navigate to={"/"} replace />;
  }

  return (
    <main>
      <section style={{ marginTop: "2rem" }}>
        <h2>Cuentas</h2>

        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Link to={"/"}>Ver socios</Link>
          <Link to={`/partner/${partnerId}/account`}>Crear cuenta</Link>
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
                <td>{account.numeroCuenta}</td>
                <td>{account.tipoCuenta}</td>
                <td>{account.estado}</td>
                <td>
                  {account.saldo.toLocaleString("es-EC", {
                    style: "currency",
                    currency: "USD",
                  })}
                </td>
                <td>{new Date(account.fechaCreacion).toLocaleDateString()}</td>
                <td>
                  {new Date(account.fechaActualizacion).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {accounts?.length === 0 && <p>No hay cuentas registradas</p>}
      </section>
    </main>
  );
}
