import addContext from "mochawesome/addContext";
import Common from "./common.page";
import Home from "./home.page";

const commonPage = new Common();
const homePage = new Home();

export default class EffortTalent {
  constructor() {
    this.inputTask = 'input[name="task"]';
    this.inputHours = 'input[name="time"]';
    this.btnDatePicker = 'button:contains("event")';
    this.btnLogHours = 'button:contains("Log hours")';
    this.btnToday = 'button:contains("Today")';
    this.alertLogHours = ".snackbars .toast.show .toast-body";
    this.highligthedDay = ".week-slider__day.active .week-slider__border";
    this.monthDatePicker = ".react-datepicker-container.month";
    this.dayDatePicker = ".react-datepicker-container.day";
    this.dayElInPicker = ".react-datepicker-picker.day.current";
    this.yearDatePicker = ".react-datepicker-container.year";
    this.innerTooltip = '.tooltip-inner'
    this.calendarTooltip = 'div[role="tooltip"].fade'
  }

  logTaskAndHours(days, hours, option, service) {
    cy.get(this.btnDatePicker)
      .click()
      .addContextText("click on calendar to open date picker");
    cy.wait(1000);
    const dateToSelect = this.calculateDate(days);
    cy.addContextText("date to select is: " + dateToSelect);
    this.selectDatePicker(dateToSelect);

    if (option !== "confirmed") {

      if(option == "review"){
        cy.get(this.inputTask).should('be.enabled')
        cy.get(this.highligthedDay)
        .should("not.include.text", "0h")
        .trigger('mouseover', {force: true})
        cy.get(this.calendarTooltip).should('be.visible').should('include.text', 'comment hours in review')
      }


      this.fillTaskAndHours(
        hours.toString(),
        `task ${option} ${dateToSelect.toString()}`
      );

      this.validateLogHoursAlert("Time logged successfully");
      cy.get(this.btnToday).click();
      cy.get(this.btnDatePicker).click();
      this.selectDatePicker(dateToSelect);
      cy.get(this.highligthedDay)
        .should("not.include.text", "0h")
        .addContextText("validate hours are marked in the calendar");
      cy.get(this.inputTask).should(
        "have.value",
        `task ${option} ${dateToSelect.toString()}`
      );

      if (option == "edit") {
        let inputHr = hours - 1;

        this.fillTaskAndHours(
          inputHr.toString(),
          `task ${option} ${dateToSelect.toString()}`
        );
        this.validateLogHoursAlert("Time logged successfully");

        cy.get(this.btnToday).click();
        cy.get(this.btnDatePicker).click();
        this.selectDatePicker(dateToSelect);

        let listingCount;
        cy.log("input HOURS : " + inputHr);
        cy.get(this.inputTask).then((listing) => {
          listingCount = Cypress.$(listing).length;
          inputHr = inputHr * (listingCount + 1);
        });
        cy.log("input HOURS : " + inputHr);
        cy.log("input TASK lengh : " + listingCount);

        if (service == "multiple") {
          inputHr = inputHr * 2;
        }
        cy.get(this.highligthedDay)
          .should("include.text", inputHr + "h")
          .addContextText("validate hours are marked in the calendar");

        cy.get(this.inputTask).each(($inputTask, index) => {
          cy.wrap($inputTask).should(
            "have.value",
            `task ${option} ${dateToSelect.toString()}`
          );
        });
      }
 
    }else{
    cy.get(this.inputTask).should('be.disabled').trigger('mouseover', {force: true})
    cy.get(this.innerTooltip).should('include.text', 'This effort has already been confirmed')

    cy.get(this.inputHours).should('be.disabled').trigger('mouseover', {force: true})
    cy.get(this.innerTooltip).should('include.text', 'This effort has already been confirmed')
    cy.addContextText("verified talent is not able to log task and hours for confirmed hours ")

    }
  }

  teardown() {
    this.fillTaskAndHours("0", "teardown-deleted");
    this.validateLogHoursAlert("Time logged successfully");
  }

  fillTaskAndHours(hours, taskText) {
    cy.get(this.inputHours).each(($inputHours, index) => {
      cy.wrap($inputHours)
        .should("be.visible")
        .clear()
        .type(hours)
        .addContextText("type: " + hours + " in hours field");
    });

    cy.get(this.inputTask).each(($inputTask, index) => {
      cy.wrap($inputTask)
        .should("be.visible")
        .clear()
        .type(taskText)
        .addContextText("type: " + taskText + " in task field");
    });

    cy.get(this.btnLogHours).click().addContextText("click on Log Hours");
  }

  calculateDate(days) {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  selectDatePicker(date) {
    // Split the date into day, month, and year
    const [day, month, year] = date.split(" ");

    cy.wait(250);
    cy.get(this.dayDatePicker).should("be.visible");
    cy.get(".react-datepicker-button.button-label.button-label").click();
    cy.wait(250);

    cy.get(this.monthDatePicker).should("be.visible");
    cy.get(".react-datepicker-button.button-label.button-label").click();
    cy.wait(250);

    cy.get(this.yearDatePicker).should("be.visible");
    // Select the year
    cy.get(this.yearDatePicker).contains(year).click();

    // Select the month
    cy.get(this.monthDatePicker).contains(month.slice(0, 3)).click();

    // Find and click on the day element

    cy.get(this.dayElInPicker)
      .contains(day)
      .filter(`:not(${this.dayElInPicker}.disabled`)
      .click();
  }

  validateLogHoursAlert(text) {
    cy.get(this.alertLogHours)
      .should("include.text", text)
      .addContextText("validate alert message with text " + text);
  }

  getInputTask() {
    return this.inputTask;
  }
}
