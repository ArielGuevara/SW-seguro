import { Link } from "react-router";
import { usePartners } from "../hooks/userPartners";

export function Home() {
  const { partners } = usePartners();

  return (
    <main style={{ padding: "1rem" }}>
      <h1>Socios</h1>

      <section>
        <Link data-cy="partner-register-link" to={"/register"}>
          Crear socio
        </Link>
      </section>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>Activo</th>
            <th>Nombres</th>
            <th>Apellidos</th>
            <th>Tipo</th>
            <th>Identificación</th>
            <th>Email</th>
            <th>Teléfono</th>
            <th>Dirección</th>
            <th>Creado</th>
            <th>Actualizado</th>
            <th>&nbsp;</th>
          </tr>
        </thead>

        <tbody>
          {partners?.map((partner) => (
            <tr key={partner.id}>
              <td data-cy="partner-activo">{partner.activo ? "✅" : "❌"}</td>
              <td data-cy="partner-nombres">{partner.nombres}</td>
              <td data-cy="partner-apellido">{partner.apellidos}</td>
              <td data-cy="partner-tipoIdentificacion">
                {partner.tipoIdentificacion}
              </td>
              <td data-cy="partner-identificacion">{partner.identificacion}</td>
              <td data-cy="partner-email">{partner.email}</td>
              <td data-cy="partner-telefono">{partner.telefono}</td>
              <td data-cy="partner-direccion">{partner.direccion}</td>
              <td data-cy="partner-fechaCreacion">
                {new Date(partner.fechaCreacion).toLocaleDateString()}
              </td>
              <td data-cy="partner-fechaActualizacion">
                {new Date(partner.fechaActualizacion).toLocaleDateString()}
              </td>
              <td>
                <Link
                  data-cy="partner-accounts-link"
                  to={`/partner/${partner.id}`}
                >
                  Ver cuentas
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {partners?.length === 0 && (
        <p data-cy="partners-placeholder">No hay socios registrados</p>
      )}
    </main>
  );
}
