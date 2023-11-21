// cypress/integration/login.spec.js

const fs = require('fs');

describe('Login Test', () => {
  it('should login using credentials from Excel file', () => {
    const excelFilePath = Cypress.env('EXCEL_FILE_PATH');

    if (!excelFilePath) {
      throw new Error('Excel file path not provided. Please set the "EXCEL_FILE_PATH" environment variable.');
    }

    cy.readFile(excelFilePath).then((data) => {
      const username = data.username;
      const password = data.password;

      cy.visit('https://stage-service-management.coderfull.com/login');
      cy.get('input[placeholder*="Username"]').should('be.visible').type(username);
      cy.get('input[placeholder*="Password"]').should('be.visible').type(password);
      cy.get('button[type="submit"]').click();

      // Add assertions or continue with your test logic
    });
  });
});
