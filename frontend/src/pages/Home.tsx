import { Link } from "react-router";
import { usePartners } from "../hooks/userPartners";

export function Home() {
  const { partners } = usePartners();

  return (
    <main style={{ padding: "1rem" }}>
      <h1>Socios</h1>

      <section>
        <Link to={"/register"}>Crear socio</Link>
      </section>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>Activo</th>
            <th>Nombres</th>
            <th>Apellidos</th>
            <th>Identificación</th>
            <th>Tipo</th>
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
              <td>{partner.activo ? "✅" : "❌"}</td>
              <td>{partner.nombres}</td>
              <td>{partner.apellidos}</td>
              <td>{partner.identificacion}</td>
              <td>{partner.tipoIdentificacion}</td>
              <td>{partner.email}</td>
              <td>{partner.telefono}</td>
              <td>{partner.direccion}</td>
              <td>{new Date(partner.fechaCreacion).toLocaleDateString()}</td>
              <td>
                {new Date(partner.fechaActualizacion).toLocaleDateString()}
              </td>
              <td>
                <Link to={`/partner/${partner.id}`}>Ver cuentas</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {partners?.length === 0 && <p>No hay socios registrados</p>}
    </main>
  );
}
