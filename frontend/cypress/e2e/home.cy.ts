describe("Home - Socios", () => {
  beforeEach(() => {
    // Mock de la API de socios
    cy.intercept("GET", "**/api/socios", {
      statusCode: 200,
      body: [
        {
          id: 1,
          activo: true,
          nombres: "Juan",
          apellidos: "Pérez",
          tipoIdentificacion: "DNI",
          identificacion: "12345678",
          email: "juan@test.com",
          telefono: "999999999",
          direccion: "Av. Principal 123",
          fechaCreacion: "2024-01-01T00:00:00.000Z",
          fechaActualizacion: "2024-01-02T00:00:00.000Z",
        },
      ],
    }).as("getPartners");

    cy.visit("/");
    cy.wait("@getPartners");
  });

  it("renderiza el título y el link para crear socio", () => {
    cy.contains("h1", "Socios").should("be.visible");
    cy.get("[data-cy=partner-register-link]")
      .should("be.visible")
      .and("have.attr", "href", "/register");
  });

  it("muestra la tabla con los socios", () => {
    cy.get("table").should("exist");

    cy.get("tbody tr").should("have.length", 1);

    cy.get("[data-cy=partner-activo]").contains("✅");
    cy.get("[data-cy=partner-nombres]").contains("Juan");
    cy.get("[data-cy=partner-apellido]").contains("Pérez");
    cy.get("[data-cy=partner-email]").contains("juan@test.com");

    cy.get("[data-cy=partner-accounts-link]")
      .should("be.visible")
      .and("have.attr", "href", "/partner/1");
  });
});

describe("Home - sin socios", () => {
  it("muestra el placeholder cuando no hay socios", () => {
    cy.intercept("GET", "**/api/socios", {
      statusCode: 200,
      body: [],
    }).as("getEmptyPartners");

    cy.visit("/");
    cy.wait("@getEmptyPartners");

    cy.get("[data-cy=partners-placeholder]")
      .should("be.visible")
      .and("contain", "No hay socios registrados");
  });
});
