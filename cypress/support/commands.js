// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
import addContext from "mochawesome/addContext";
const compareSnapshotCommand = require("cypress-visual-regression/dist/command");
const beforeCompareSnapshotCommand = require("./commands/beforeCompareSnapshotCommand");

compareSnapshotCommand();
beforeCompareSnapshotCommand(".chromatic-ignore,[data-chromatic='ignore']");

Cypress.Commands.add("getIframeDocument", () => {
  cy.get('iframe[id*="Safe"]').its("0.contentDocument").should("exist");
});

Cypress.Commands.add("getIframeBody", () => {
  cy.getIframeDocument().its("body").should("not.be.undefined").then(cy.wrap);
});

Cypress.Commands.add("getIframe", () => {
  cy.get('iframe[id*="Safe"]').then(cy.wrap);
});

Cypress.Commands.add("elementExists", (selector) => {
  return cy
    .window()
    .then(($window) => $window.document.querySelector(selector));
});

Cypress.Commands.add("addContextText", (context) => {
  cy.once("test:after:run", (test) => addContext({ test }, context));
});

Cypress.on("test:after:run", (test, runnable) => {
  if (test.state === "failed") {
    addContext(
      { test },
      {
        title: "Screenshot of failure",
        value: `../cypress/snapshots/actual/${
          Cypress.spec.name
        }/${runnable.parent.title.replace(":", "")} -- ${
          test.title
        } (failed).png`,
      }
    );
  }
});


Cypress.Commands.add('parseXlsx', (inputFile) => {
  return cy.task('parseXlsx', { filePath: inputFile })
  })
