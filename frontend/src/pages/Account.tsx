import { Link, useNavigate, useParams } from "react-router";
import { usePartner } from "../hooks/usePartner";
import type { AccountRequestDTO } from "../models/account";
import { Field, Form, Formik, type FormikHelpers } from "formik";
import { useMemo, useState } from "react";
import { useAccount } from "../hooks/useAccount";
import { useAccountsByPartner } from "../hooks/useAccountsByPartner";

export function Account() {
  const { partnerId } = useParams();
  const { partner } = usePartner({ id: partnerId });
  const { accounts } = useAccountsByPartner({ id: partnerId });
  const { createAccount } = useAccount();
  const navigate = useNavigate();
  const [formError, setFormError] = useState("");

  const initValues = useMemo(() => {
    const nextCountAccount = ((accounts?.length ?? 0) + 1)
      .toString()
      .padStart(3, "0");
    const partnerIdentification =
      partner?.identificacion.substring(0, 10) ?? "123456789";

    return {
      numeroCuenta: `${nextCountAccount}-${partnerIdentification}`,
      saldo: 5,
      socioId: partner?.id ?? "",
      tipoCuenta: "AHORRO",
    };
  }, [partner?.id, partner?.identificacion, accounts]);

  const onSubmit = async (
    values: AccountRequestDTO,
    { resetForm, setSubmitting }: FormikHelpers<AccountRequestDTO>,
  ) => {
    try {
      await createAccount(values);
      resetForm();
      navigate(`/partner/${partnerId}`, { replace: true });
    } catch {
      setFormError("Socio no pudo ser registrado");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main>
      <h1>Crear cuenta</h1>
      <p>
        Para: {partner?.nombres} {partner?.apellidos}
      </p>
      <Formik initialValues={initValues} onSubmit={onSubmit} enableReinitialize>
        <Form>
          <div>
            <label htmlFor="numeroCuenta">Numero de cuenta</label>
            <Field
              type="text"
              id="numeroCuenta"
              name="numeroCuenta"
              readOnly
              data-cy="input-numeroCuenta"
            />
          </div>
          <div>
            <label htmlFor="saldo">Saldo</label>
            <Field
              type="number"
              id="saldo"
              name="saldo"
              readOnly
              data-cy="input-saldo"
            />
          </div>
          <div>
            <label htmlFor="tipoCuenta">Tipo de cuenta</label>
            <Field
              as="select"
              id="tipoCuenta"
              name="tipoCuenta"
              data-cy="input-tipoCuenta"
            >
              <option value={"AHORRO"}>Ahorro</option>
              <option value={"CORRIENTE"}>Corriente</option>
            </Field>
          </div>
          <button type="submit">Crear</button>
          {formError && (
            <p id="error-form" data-cy="error-form">
              {formError}
            </p>
          )}
        </Form>
      </Formik>
      <Link to={`/partner/${partnerId}`} data-cy="partner-accounts-link">
        Ver mis cuentas
      </Link>
    </main>
  );
}
