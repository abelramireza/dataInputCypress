import addContext from "mochawesome/addContext";
import Common from "./common.page";
import Home from "./home.page";
import { forEachChild } from "typescript";

const commonPage = new Common();
const homePage = new Home();

export default class DayOffTalent {
  constructor() {
    this.btnDaysOff = '.days-off-dropdown button'
    this.btnAskforDayOff = 'button.days-off-button'
    this.inputDaysOffFrom = 'label:contains("From") + .react-datepicker-component input'
    this.inputDaysOffTo = 'label:contains("To") + .react-datepicker-component input'
    this.iconCalendar = '.icon-rc-datepicker_calendar'
    this.btnSendRequest = 'button:contains("Send request")';
    this.txtTittle = '.day-off-modal-tittle'
    this.modalCnfOnRev = '.modal-content .days-off-success'
    this.btnGotIt = 'button:contains("Got it")';
  }



  requestTimeOffTalent(fromDays, toDays) {
    cy.get(this.btnDaysOff)
      .should('be.visible')
      .click()
      .addContextText("click on Time off");
  
    cy.get(this.btnAskforDayOff)
      .should('be.visible')
      .click()
      .addContextText("click on Ask for Time off");

     
      const timeoffDateFrom = this.formatDate(fromDays);
      cy.get(this.inputDaysOffFrom).type(timeoffDateFrom)

      const timeoffDateTo = this.formatDate(toDays);
      cy.get(this.inputDaysOffTo).click().type(timeoffDateTo)

    cy.get(this.txtTittle).click()
      cy.get(this.btnSendRequest).click()

      cy.get(this.modalCnfOnRev).should('be.visible').should("include.text", "Days off on review")
      cy.get(this.btnGotIt).should('be.visible').click()



  }

formatDate(range) {

    const date = new Date();
    date.setDate(date.getDate() + range);
    const options = { year: 'numeric', month: 'short', day: '2-digit' };
    return date.toLocaleDateString('en-US', options).toString();
  }
  


}
