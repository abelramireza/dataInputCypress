import Common from "./common.page";
import Home from "./home.page";

const commonPage = new Common();
const homePage = new Home();

export default class EfforManager  {
  constructor() {
    this.timesheet = 'div:contains("Timesheet") > span:contains("restore")';
    this.timeFrimeWeekBtn = ".weekly-total-effort__circle";
    this.getWeekTimeFrame = "div.d-flex > h4";
    this.nextWeekbtn = 'div.d-flex > button.ml-1';
    this.previosWeekbtn = "div.d-flex > button.pl-0";
    this.actionsBtn = '.btn.btn-primary:contains("Actions")';
    this.confirmHours = 'a.dropdown-item:contains("Confirm hours")';
    this.hoursOnReview = 'a.dropdown-item:contains("Hours on review")';
    this.checkBoxTalentEffort = "input#serviceLegalSignOff";
    this.commentHoursOnReview = "textarea.form-control";
    this.saveBtnHoursOnReview = 'button:contains("Save")';
  }

  manageHoursSM(days, action) {
    cy.get(homePage.getManagerView()).should("be.visible").click();
    cy.get(this.timesheet).should("be.visible").click();
    cy.get(this.timeFrimeWeekBtn).first().click();

    this.checkWeekAndContinue(days);

    cy.get(this.checkBoxTalentEffort).each(($checkBox) => {
      cy.wrap($checkBox).check();
    });

    cy.get(this.actionsBtn).should("be.visible").click();

    if ((action = "confirm")) {
      cy.get(this.confirmHours).should("be.visible").click();
    } else if ((action = "review")) {
      cy.get(this.hoursOnReview).should("be.visible").click();
      cy.get(this.commentHoursOnReview).type("comment hours on review");
      cy.get(this.saveBtnHoursOnReview).should("be.enabled").click();
      cy.get(this.actionsBtn).should("be.visible");
    }
  }

  checkWeekAndContinue(days) {
    cy.get(this.getWeekTimeFrame).then(($txt) => {
      let weekTimeTxt = $txt.text();
      let bWeekFound = this.isDateInWeekFrame(weekTimeTxt, days);
      cy.log(bWeekFound);
      cy.log(weekTimeTxt);

      if (!bWeekFound) {
        // If the week is not found, click the "nextWeekbtn" and call this function recursively
        cy.get(this.nextWeekbtn).click();
        this.checkWeekAndContinue(days);
      }
    });
  }

  manageHoursEM(days) {
    cy.get(homePage.getManagerView()).should("be.visible").click();
    cy.get(this.timesheet).should("be.visible").click();
    cy.get(this.previosWeekbtn).click();
    cy.wait(100);
    cy.get(this.previosWeekbtn).click();
    this.checkWeekAndContinue(days);

    cy.get(".service-total-effort__check")
      .parent()
      .siblings(".service-total-effort__title")
      .click();

    cy.get(this.checkBoxTalentEffort).each(($checkBox) => {
      cy.wrap($checkBox).check();
    });

    cy.get(this.actionsBtn).should("be.visible").click();
    cy.get(this.hoursOnReview).should("be.visible").click();
    cy.get(this.commentHoursOnReview).type("teardown");
    cy.get(this.saveBtnHoursOnReview).should("be.enabled").click();
  }

  isDateInWeekFrame(weekFrameStr, days) {
    // Parse the input date string and week frame string
    const date = new Date();
    date.setDate(date.getDate() + days);
    cy.log("date: " + date);
    const [weekStartStr, weekEndStr] = weekFrameStr.split(" - ");
    cy.log("weekStartStr:" + weekStartStr);
    cy.log("weekEndStr:" + weekEndStr);
    // Parse the week start and end dates
    const [startMonth, startDay] = weekStartStr.split(" ");
    const endDay = weekEndStr;

    cy.log("startDay:" + startDay);
    cy.log("endDay:" + endDay);

    // Calculate the start and end dates for the week frame
    const startDate = new Date(
      date.getFullYear(),
      this.getMonthIndex(startMonth),
      startDay
    ); // Month is 0-based
    cy.log("startDate : " + startDate);
    const endDate = new Date(
      date.getFullYear(),
      this.getMonthIndex(startMonth),
      endDay
    ); // Month is 0-based
    cy.log("endDate : " + endDate);
    // Check if the input date falls within the week frame
    return date >= startDate && date <= endDate;
  }

  A;

  // Helper function to get the month index (0-based) from its name
  getMonthIndex(monthName) {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return months.indexOf(monthName);
  }

  formatDateYYYYMMDD(days) {
    const date = new Date();
    date.setDate(date.getDate() + days);
    const year = date.toLocaleString("default", { year: "numeric" });
    const month = date.toLocaleString("default", {
      month: "2-digit",
    });
    const day = date.toLocaleString("default", { day: "2-digit" });

    return [year, month, day].join("-");
  }
}
