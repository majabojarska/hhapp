// https://docs.cypress.io/api/introduction/api.html

describe("Login", () => {
  it("Type wrong password", () => {
    cy.visit("/");
    cy.get("input")
      .eq(0)
      .type("wronguser");
    cy.get("input")
      .eq(1)
      .type("wrongpassword");
    cy.get("button").click();
    cy.get(".v-dialog").should("contain", "Invalid username or password");
    cy.url().should("include", "login");
  });

  it("Type right password", () => {
    cy.visit("/");
    cy.get("input")
      .eq(0)
      .type("demouser");
    cy.get("input")
      .eq(1)
      .type("topsecret");
    cy.get("button").click();
    cy.url().should("not.include", "login");
  });
});
