import { ErrorMessage, Field, Form, Formik, type FormikHelpers } from "formik";
import type { PartnerRequestDTO } from "../models/partner";
import { usePartner } from "../hooks/usePartner";
import { Link, useNavigate } from "react-router";
import * as yup from "yup";
import { useState } from "react";

const initValues: PartnerRequestDTO = {
  identificacion: "",
  nombres: "",
  apellidos: "",
  email: "",
  telefono: "",
  direccion: "",
  tipoIdentificacion: "CEDULA",
};

const validationSchema = yup.object({
  identificacion: yup
    .string()
    .when("tipoIdentificacion", {
      is: "RUC",
      then: (schema) => schema.length(13, "Ingrese un RUC valido"),
      otherwise: (schema) => schema.length(10, "Ingrese una cedula valida"),
    })
    .required("Este campo es obligatorio"),
  nombres: yup
    .string()
    .min(3, "Es un nombre muy corto")
    .max(50, "Es un nombre muy largo")
    .required("Este campo es obligatorio"),
  apellidos: yup
    .string()
    .min(3, "Es un nombre muy corto")
    .max(50, "Es un nombre muy largo")
    .required("Este campo es obligatorio"),
  email: yup
    .string()
    .email("Ingrese un correo electronico valido")
    .required("Este campo es obligatorio"),
  telefono: yup
    .string()
    .length(10, "Ingrese un telefono valido de 10 digitos")
    .required("Este campo es obligatorio")
    .test("is-only-numbers", "El telefono debe contener solo numero", (value) =>
      value.split("").every((c) => !isNaN(Number(c))),
    ),
  direccion: yup
    .string()
    .min(5, "Direccion muy corta")
    .max(100, "Direccion muy larga")
    .required("Este campo es obligatorio"),
  tipoIdentificacion: yup
    .string()
    .oneOf(["CEDULA", "RUC"])
    .required("Este campo es obligatorio"),
});

export function Register() {
  const { createPartner } = usePartner();
  const navigate = useNavigate();
  const [formError, setFormError] = useState("");

  const onSubmit = async (
    values: PartnerRequestDTO,
    { setSubmitting, resetForm }: FormikHelpers<PartnerRequestDTO>,
  ) => {
    try {
      await createPartner(values);
      resetForm();
      navigate("/", {
        replace: true,
      });
    } catch {
      setFormError("Socio no pudo ser registrado");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main>
      <h1>Crear socio</h1>
      <Formik
        initialValues={initValues}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
      >
        {({ isSubmitting }) => (
          <Form>
            <div>
              <label htmlFor="nombres">Nombres</label>
              <Field
                type="text"
                id="nombres"
                name="nombres"
                data-cy="input-nombres"
              />
              <ErrorMessage
                component={"p"}
                id="error-nombres"
                name="nombres"
                data-cy="error-nombres"
              />
            </div>
            <div>
              <label htmlFor="apellidos">Apellidos</label>
              <Field
                type="text"
                id="apellidos"
                name="apellidos"
                data-cy="input-apellidos"
              />
              <ErrorMessage
                component={"p"}
                id="error-apellidos"
                name="apellidos"
                data-cy="error-apellidos"
              />
            </div>
            <div>
              <label htmlFor="tipoIdentificacion">Tipo de identificacion</label>
              <Field
                as="select"
                id="tipoIdentificacion"
                name="tipoIdentificacion"
                data-cy="input-tipoIdentificacion"
              >
                <option value="CEDULA">Cedula</option>
                <option value="RUC">Ruc</option>
              </Field>
              <ErrorMessage
                component={"p"}
                id="error-tipoIdentificacion"
                name="tipoIdentificacion"
                data-cy="error-tipoIdentificacion"
              />
            </div>
            <div>
              <label htmlFor="identificacion">Identificacion</label>
              <Field
                type="text"
                id="identificacion"
                name="identificacion"
                data-cy="input-identificacion"
              />
              <ErrorMessage
                component={"p"}
                id="error-identificacion"
                name="identificacion"
                data-cy="error-identificacion"
              />
            </div>
            <div>
              <label htmlFor="email">Correo electronico</label>
              <Field
                type="email"
                id="email"
                name="email"
                data-cy="input-email"
              />
              <ErrorMessage
                component={"p"}
                id="error-email"
                name="email"
                data-cy="error-email"
              />
            </div>
            <div>
              <label htmlFor="telefono">Telefono</label>
              <Field
                type="phone"
                id="telefono"
                name="telefono"
                data-cy="input-telefono"
              />
              <ErrorMessage
                component={"p"}
                id="error-telefono"
                name="telefono"
                data-cy="error-telefono"
              />
            </div>
            <div>
              <label htmlFor="direccion">Direccion</label>
              <Field
                type="text"
                id="direccion"
                name="direccion"
                data-cy="input-direccion"
              />
              <ErrorMessage
                component={"p"}
                id="error-direccion"
                name="direccion"
                data-cy="error-direccion"
              />
            </div>
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creando..." : "Crear"}
            </button>
            {formError && (
              <p id="error-form" data-cy="error-form">
                {formError}
              </p>
            )}
          </Form>
        )}
      </Formik>
      <Link to="/" data-cy="partners-link">
        Ver socios
      </Link>
    </main>
  );
}
