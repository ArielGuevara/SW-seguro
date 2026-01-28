describe("Partner - Cuentas del socio", () => {
  it("redirige al home si no hay partnerId", () => {
    cy.visit("/partner");
    cy.url().should("eq", `${Cypress.config().baseUrl}/`);
  });

  describe("con cuentas registradas", () => {
    beforeEach(() => {
      cy.intercept("GET", "/cuentas/socio/*", {
        statusCode: 200,
        body: [
          {
            numeroCuenta: "001-1234567890",
            tipoCuenta: "AHORROS",
            estado: "ACTIVA",
            saldo: 1500.5,
            fechaCreacion: "2024-01-01T00:00:00.000Z",
            fechaActualizacion: "2024-01-02T00:00:00.000Z",
          },
        ],
      }).as("getAccounts");

      cy.visit("/partner/04697e9a-b9a5-4a24-9b91-e9e3821a0609");
      cy.wait("@getAccounts");
    });

    it("renderiza la tabla de cuentas", () => {
      cy.contains("h2", "Cuentas").should("be.visible");
      cy.get("table").should("exist");
      cy.get("[data-cy=account-numeroCuenta]").should(
        "contain",
        "001-1234567890",
      );
      cy.get("[data-cy=account-tipoCuenta]").should("contain", "AHORROS");
      cy.get("[data-cy=account-estado]").should("contain", "ACTIVA");
      cy.get("[data-cy=account-saldo]").should("contain", "$");
    });

    it("muestra los links de navegación", () => {
      cy.get("[data-cy=partners-link]")
        .should("be.visible")
        .and("have.attr", "href", "/");

      cy.get("[data-cy=account-register-link]")
        .should("be.visible")
        .and(
          "have.attr",
          "href",
          "/partner/04697e9a-b9a5-4a24-9b91-e9e3821a0609/account",
        );
    });
  });

  describe("sin cuentas registradas", () => {
    it("muestra el placeholder", () => {
      cy.intercept("GET", "/cuentas/socio/*", {
        statusCode: 200,
        body: [],
      }).as("getEmptyAccounts");

      cy.visit("/partner/04697e9a-b9a5-4a24-9b91-e9e3821a0609");
      cy.wait("@getEmptyAccounts");

      cy.get("[data-cy=accounts-placeholder]")
        .should("be.visible")
        .and("contain", "No hay cuentas registradas");
    });
  });
});
