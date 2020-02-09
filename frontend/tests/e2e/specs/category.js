// https://docs.cypress.io/api/introduction/api.html

describe("Categories", () => {
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
  it("Add category", () => {
    cy.get("#app > div > header > div > button").click();
    cy.get(
      ".container > .v-list > .v-list-item:nth-child(3) > .v-list-item__content > .v-list-item__title"
    ).click();
    cy.get(
      ".v-content > .v-content__wrap > .container > .v-btn > .v-btn__content"
    ).click();
    cy.get(
      ".v-input > .v-input__control > .v-input__slot > .v-text-field__slot > input"
    ).click();
    cy.get(
      ".v-input > .v-input__control > .v-input__slot > .v-text-field__slot > input"
    ).type("Test");
    cy.get(
      ".v-input__control > .v-input__slot > .v-slider > .v-slider__thumb-container > .v-slider__thumb"
    ).click();
    cy.get(
      ".v-input > .v-input__control > .v-input__slot > .v-input--selection-controls__input > .v-input--selection-controls__ripple"
    ).click();
    cy.get(
      ".v-dialog > .v-card > .v-card__actions > .v-btn:nth-child(3) > .v-btn__content"
    ).click();
    cy.get(
      "#app > div.v-application--wrap > main > div > div > div.v-card.v-sheet.theme--light > div.v-snack.v-snack--active.v-snack--bottom > div > div > button"
    ).click();
  });
  it("Edit category", () => {
    cy.get(
      ".container > .v-card > .v-list > .v-list-item:last-child > .v-list-item__content"
    ).click();
    cy.get(
      "#app > div.v-dialog__content.v-dialog__content--active > div > div > div.v-card__text > form > div:nth-child(1) > div:nth-child(1) > div > div.v-input__control > div.v-input__slot"
    ).click();
    cy.get(
      ".v-input > .v-input__control > .v-input__slot > .v-text-field__slot > input"
    ).type(" edit");
    cy.get(
      ".v-color-picker__sliders > .v-input > .v-input__control > .v-input__slot > .v-slider"
    ).click();
    cy.get(
      ".col-sm-6 > .v-input > .v-input__control > .v-input__slot > .v-label"
    ).click();
    cy.get(
      ".v-dialog > .v-card > .v-card__actions > .v-btn:nth-child(3) > .v-btn__content"
    ).click();
  });

  it("Remove category", () => {
    cy.get(
      "#app > div.v-application--wrap > main > div > div > div.v-card.v-sheet.theme--light > div > div:last-child > div.v-list-item__action > button"
    ).click();
    cy.get(
      "#app > div.v-menu__content.theme--light.menuable__content__active > div > div"
    ).click();
    cy.get(
      "#app > div.v-application--wrap > main > div > div > div.v-card.v-sheet.theme--light > div.v-snack.v-snack--active.v-snack--bottom > div"
    ).should("include.text", "Category deleted.");
  });
});
