describe("convert data to Json", () => {
  it("read data from excel", () => {
    cy.parseXlsx(Cypress.env('EXCEL_FILE_PATH')).then((jsonData) => {
      cy.log(jsonData);

      const rowLength = Cypress.$(jsonData[0].data).length;
      cy.log(rowLength);

      for (let index = 0; index < rowLength; index++) {
        cy.log(jsonData[0].data[index]);
        cy.writeFile("cypress/fixtures/xlsxData.json", { jsonData });
      }
    });
  });
});

describe("Demo for talent update", function () {
  it("Sample test case of talent data input", function () {
    cy.visit("https://stage-service-management.coderfull.com/");
    cy.fixture("xlsxData").then((data) => {
      cy.log(data.jsonData[0].data[1][0]);
      cy.log(data.jsonData[1].data[1][0]);
      cy.get('input[placeholder*="Username"]').type(
        data.jsonData[0].data[1][0]
      );
      cy.get('input[placeholder*="Password"]').type(
        data.jsonData[0].data[1][1]
      );

      cy.wait(1000);
      cy.get('button[type="submit"]').click();
      cy.wait(2000);
      cy.get('button:contains("Manager View")').should('be.visible').click()
      cy.wait(5000);

      cy.log(data.jsonData[1].data.length)

    
      for (let i = 1; i < data.jsonData[1].data.length; i++) {
        //cy.get('input[placeholder*="Search"]').eq(1).clear()
        cy.wait(1000)
        cy.get('input[placeholder*="Search"]').first().clear().type(data.jsonData[1].data[i][0] + " " + data.jsonData[1].data[i][1])
        cy.wait(3000)
        cy.get('.search-field__dropdown').contains(data.jsonData[1].data[i][0]).click()
        cy.wait(3000)
        cy.log(data.jsonData[1].data[i][2])
      
        if (data.jsonData[1].data[i][2] !== null) {
          cy.get('input[placeholder*="Search"]').eq(1).type(data.jsonData[1].data[i][2])
          cy.wait(3000)
          cy.get('.search-field__dropdown').contains(data.jsonData[1].data[i][2]).click()
          cy.wait(1000)
        }
        cy.get('.material-icons.cursor-pointer').click()
        cy.get('.btn.btn-block.btn-link:contains("Details")').click()
        cy.getIframeBody().should('exist')
        cy.wait(2000)
        cy.get('button:contains("Next")').click()
        cy.wait(2000)
        cy.get('button:contains("Next")').click()
        cy.wait(1000)

        cy.contains('label', 'Personal Email *').then(($label) => {
          // Get the input field associated with the label
          const inputField = $label.next('input');
    
          // Type into the input field
          cy.wrap(inputField).clear().type(data.jsonData[1].data[i][3]);
        });

        cy.get('.input-group>input').eq(2).clear().type(data.jsonData[1].data[i][4])

        cy.get('button:contains("Save")').click()
        cy.wait(3000)
        cy.get('button:contains("Talent View")').should('be.visible').click()
        cy.wait(2000)
        cy.get('button:contains("Manager View")').should('be.visible').click()
      }
      
    });


  });
});
