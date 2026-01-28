describe("Register - Crear socio", () => {
  beforeEach(() => {
    cy.visit("/register");
  });

  it("renderiza el formulario", () => {
    cy.contains("h1", "Crear socio").should("be.visible");

    cy.get("[data-cy=input-nombres]").should("be.visible");
    cy.get("[data-cy=input-apellidos]").should("be.visible");
    cy.get("[data-cy=input-tipoIdentificacion]").should("be.visible");
    cy.get("[data-cy=input-identificacion]").should("be.visible");
    cy.get("[data-cy=input-email]").should("be.visible");
    cy.get("[data-cy=input-telefono]").should("be.visible");
    cy.get("[data-cy=input-direccion]").should("be.visible");

    cy.contains("button", "Crear").should("be.enabled");
    cy.contains("a", "Ver socios").should("have.attr", "href", "/");
  });

  it("muestra errores al enviar el formulario vacío", () => {
    cy.contains("button", "Crear").click();

    cy.get("[data-cy=error-nombres]").should("be.visible");
    cy.get("[data-cy=error-apellidos]").should("be.visible");
    cy.get("[data-cy=error-identificacion]").should("be.visible");
    cy.get("[data-cy=error-email]").should("be.visible");
    cy.get("[data-cy=error-telefono]").should("be.visible");
    cy.get("[data-cy=error-direccion]").should("be.visible");
  });

  it("valida cedula (10 dígitos)", () => {
    cy.get("[data-cy=input-identificacion]").type("123");
    cy.contains("button", "Crear").click();

    cy.get("[data-cy=error-identificacion]").should(
      "contain",
      "Ingrese una cedula valida",
    );
  });

  it("valida RUC (13 dígitos)", () => {
    cy.get("[data-cy=input-tipoIdentificacion]").select("RUC");
    cy.get("[data-cy=input-identificacion]").type("123");
    cy.contains("button", "Crear").click();

    cy.get("[data-cy=error-identificacion]").should(
      "contain",
      "Ingrese un RUC valido",
    );
  });

  it("registra un socio correctamente y redirige al home", () => {
    cy.intercept("POST", "**/api/socios", {
      statusCode: 201,
      body: { id: 1 },
    }).as("createPartner");

    cy.get("[data-cy=input-nombres]").type("Juan");
    cy.get("[data-cy=input-apellidos]").type("Pérez");
    cy.get("[data-cy=input-tipoIdentificacion]").select("CEDULA");
    cy.get("[data-cy=input-identificacion]").type("1234567890");
    cy.get("[data-cy=input-email]").type("juan@test.com");
    cy.get("[data-cy=input-telefono]").type("0999999999");
    cy.get("[data-cy=input-direccion]").type("Av. Principal 123");

    cy.contains("button", "Crear").click();

    cy.wait("@createPartner");
    cy.url().should("eq", `${Cypress.config().baseUrl}/`);
  });

  it("muestra mensaje de error si el backend falla", () => {
    // Interceptamos el POST para que falle
    cy.intercept("POST", "http://localhost:8080/api/socios", {
      statusCode: 500,
      body: { message: "Error interno del servidor" },
    }).as("createPartnerFail");

    // Llenamos el formulario
    cy.get("[data-cy=input-nombres]").type("Juan");
    cy.get("[data-cy=input-apellidos]").type("Pérez");
    cy.get("[data-cy=input-tipoIdentificacion]").select("CEDULA");
    cy.get("[data-cy=input-identificacion]").type("1234567890");
    cy.get("[data-cy=input-email]").type("juan@example.com");
    cy.get("[data-cy=input-telefono]").type("0987654321");
    cy.get("[data-cy=input-direccion]").type("Calle Falsa 123");

    // Enviamos el formulario
    cy.get("button[type=submit]").click();

    // Esperamos la llamada al backend
    cy.wait("@createPartnerFail");

    // Esperamos explícitamente a que el error aparezca en el DOM
    cy.get("[data-cy=error-form]", { timeout: 5000 })
      .should("be.visible")
      .and("contain.text", "Socio no pudo ser registrado");

    // Verificamos que el formulario no se reseteó
    cy.get("[data-cy=input-nombres]").should("have.value", "Juan");
  });
});
