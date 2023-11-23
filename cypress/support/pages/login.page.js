import Common from "./common.page";
import Home from "./home.page";


const commonPage = new Common();
const homePage = new Home();


export default class Login {
  constructor() {
    this.userNameInput = 'input[placeholder*="Username"]';
    this.passwordInput = 'input[placeholder*="Password"]';
    this.loginBtn = 'button[type="submit"]';
    this.warningEnvMessage = ".warning > div > div > b";

  }

  loginToCoderFull(role,option) {
    // Check the welcome message and environment
    cy.get(this.warningEnvMessage)
      .should("be.visible")
      .should("contain", "Welcome")
      .should("contain", Cypress.env("environment"));

    // Enter username and password
    cy.get(this.userNameInput)
      .should("be.visible")
      .clear()
      .type(Cypress.env(role)[option].user)

    cy.addContextText("type user: " + Cypress.env(role)[option].user);

    cy.get(this.passwordInput)
      .should("be.visible")
      .clear()
      .type(Cypress.env(role)[option].password);
    

    cy.addContextText("type password: " + Cypress.env(role)[option].password);

    // Click the login button
    cy.get(this.loginBtn).click();
    cy.addContextText("click on login button");

    // validate login
    cy.get(homePage.getBrandHeader()).should("be.visible");
    cy.addContextText("Logged in as " + role);

    // Check elements based on the user role
    switch (role) {
      case "talent":

        cy.get(homePage.getDashboardProfile())
          .should("be.visible");

        cy.get(homePage.getContainTM())
          .should("be.visible")
          .addContextText(
            "verify: " +
              homePage.getContainTM() +
              "  has Talent Manager displayed"
          );

        cy.get(homePage.getDashboardViewTabs())
          .should("not.exist")
          .addContextText(
            "verify is not present: " +
              homePage.getDashboardViewTabs() +
              " no tabs for SM/EM are displayed"
          );

        break;

      case "Service Manager":
        cy.get(homePage.getContainTM())
          .should("not.exist")
          .addContextText(
            "verify is nor present: " +
              homePage.getContainTM() +
              "   Talent Manager is not displayed "
          );

        cy.get(homePage.getDashboardViewTabs())
          .should("be.visible")
          .addContextText(
            "verify: " +
              homePage.getDashboardViewTabs() +
              " tabs for SM is displayed"
          );

        cy.get(homePage.getDashboardProfile()).should("contain", role);

        break;

      case "Engagement Manager":
        cy.get(homePage.getContainTM())
          .should("not.exist")
          .addContextText(
            "verify is nor present: " +
              homePage.getContainTM() +
              "   Talent Manager is not displayed "
          );

        cy.get(homePage.getDashboardViewTabs())
          .should("be.visible")
          .addContextText(
            "verify: " +
              homePage.getDashboardViewTabs() +
              " tabs for SM is displayed"
          );

        cy.get(homePage.getDashboardProfile()).should("contain", role);

        break;

      case "Service Admin":
        //Collect the items then assert the list
        const items = [];
        const expectedLabels = ["Clients", "Efforts", "Billing"]
        cy.get(homePage.getLabelsForSA()).each(($li) => items.push($li.text()));
        // the items reference is set once

        cy.wrap(items)
          .should("deep.equal", expectedLabels)
          .addContextText("verify: " + JSON.stringify(expectedLabels) + " labels are displayed")

        break;

      case "CP":
      case "presales":
      case "TA":
      case "TM":
      default:
        cy.log("Unknown role: " + role);
        throw new Error("test fails no existing role");
    }
  }
}
