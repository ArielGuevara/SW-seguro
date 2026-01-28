describe("Account - Crear cuenta de socio", () => {
  const partnerId = "04697e9a-b9a5-4a24-9b91-e9e3821a0609";
  const partnerMock = {
    id: partnerId,
    nombres: "Juan",
    apellidos: "Pérez",
    identificacion: "1234567890",
  };
  const accountsMock = [
    {
      numeroCuenta: "001-1234567890",
      tipoCuenta: "AHORRO",
      estado: "ACTIVA",
      saldo: 1500,
      fechaCreacion: "2024-01-01T00:00:00.000Z",
      fechaActualizacion: "2024-01-02T00:00:00.000Z",
    },
  ];

  beforeEach(() => {
    // Mock del socio
    cy.intercept("GET", `**/api/socios/${partnerId}`, {
      statusCode: 200,
      body: partnerMock,
    }).as("getPartner");

    // Mock de las cuentas existentes
    cy.intercept("GET", `**/cuentas/socio/${partnerId}`, {
      statusCode: 200,
      body: accountsMock,
    }).as("getAccounts");

    // Mock del POST para crear cuenta
    cy.intercept("POST", "**/cuentas", {
      statusCode: 201,
      body: { ...accountsMock[0], numeroCuenta: "002-1234567890" },
    }).as("createAccount");

    cy.visit(`/partner/${partnerId}/account`);
    cy.wait(["@getPartner", "@getAccounts"]);
  });

  it("renderiza el formulario con datos correctos", () => {
    cy.contains("h1", "Crear cuenta").should("be.visible");
    cy.contains("Para: Juan Pérez").should("be.visible");

    cy.get("[data-cy=input-numeroCuenta]")
      .should("have.value", "002-1234567890") // siguiente número de cuenta
      .and("have.attr", "readonly");

    cy.get("[data-cy=input-saldo]")
      .should("have.value", "5")
      .and("have.attr", "readonly");

    cy.get("[data-cy=input-tipoCuenta]").should("have.value", "AHORRO");
  });

  it("permite seleccionar tipo de cuenta y crear", () => {
    cy.get("[data-cy=input-tipoCuenta]").select("CORRIENTE");

    cy.contains("button", "Crear").click();

    cy.wait("@createAccount");

    // Redirige a la lista de cuentas del socio
    cy.url().should("eq", `${Cypress.config().baseUrl}/partner/${partnerId}`);
  });

  it("muestra mensaje de error si el backend falla al crear cuenta", () => {
    cy.intercept("POST", "**/cuentas", {
      statusCode: 500,
      body: { message: "Error interno del servidor" },
    }).as("createAccountFail");

    // Asume que ya estás en la página de crear cuenta con partnerId válido
    cy.get("[data-cy=input-tipoCuenta]").select("AHORRO");
    cy.get("[data-cy=input-numeroCuenta]").should("exist"); // readonly
    cy.get("[data-cy=input-saldo]").should("exist"); // readonly

    cy.get("button[type=submit]").click();
    cy.wait("@createAccountFail");

    cy.get("[data-cy=error-form]")
      .should("be.visible")
      .and("contain", "Socio no pudo ser registrado");
  });

  it("navega de regreso a las cuentas", () => {
    cy.get("[data-cy=partner-accounts-link]")
      .should("have.attr", "href", `/partner/${partnerId}`)
      .click();

    cy.url().should("eq", `${Cypress.config().baseUrl}/partner/${partnerId}`);
  });
});
