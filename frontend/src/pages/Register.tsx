import { Field, Form, Formik } from "formik";
import type { PartnerRequestDTO } from "../models/partner";
import { usePartner } from "../hooks/usePartner";
import { Link, useNavigate } from "react-router";

const initFormData: PartnerRequestDTO = {
  identificacion: "",
  nombres: "",
  apellidos: "",
  email: "",
  telefono: "",
  direccion: "",
  tipoIdentificacion: "CEDULA",
};

export function Register() {
  const { createPartner } = usePartner();
  const navigate = useNavigate();

  const onSubmit = async (values: PartnerRequestDTO) => {
    await createPartner(values);
    navigate("/", {
      replace: true,
    });
  };

  return (
    <main>
      <h1>Crear socio</h1>
      <Formik initialValues={initFormData} onSubmit={onSubmit}>
        <Form>
          <div>
            <label htmlFor="nombres">Nombres</label>
            <Field type="text" id="nombres" name="nombres" />
          </div>
          <div>
            <label htmlFor="apellidos">Apellidos</label>
            <Field type="text" id="apellidos" name="apellidos" />
          </div>
          <div>
            <label htmlFor="tipoIdentificacion">Tipo de identificacion</label>
            <Field
              as="select"
              id="tipoIdentificacion"
              name="tipoIdentificacion"
            >
              <option value="CEDULA">Cedula</option>
              <option value="RUC">Ruc</option>
            </Field>
          </div>
          <div>
            <label htmlFor="identificacion">Identificacion</label>
            <Field type="text" id="identificacion" name="identificacion" />
          </div>
          <div>
            <label htmlFor="email">Correo electronico</label>
            <Field type="email" id="email" name="email" />
          </div>
          <div>
            <label htmlFor="telefono">Telefono</label>
            <Field type="phone" id="telefono" name="telefono" />
          </div>
          <div>
            <label htmlFor="direccion">Direccion</label>
            <Field type="text" id="direccion" name="direccion" />
          </div>
          <button type="submit">Crear</button>
        </Form>
      </Formik>
      <Link to="/">Ver socios</Link>
    </main>
  );
}
