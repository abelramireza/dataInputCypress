import Common from "./common.page";

const commonPage = new Common();

export default class Home {
  constructor() {
    this.brandHeader = ".app-header__brand";
    this.dshViewTabs = ".dashboard-view-tabs";
    this.dshProfile = ".dashboard-profile > div";
    this.containTM = ".container-tm";
    this.circularBlueChip = ".chip-circular.chip-blue-light > span";
    this.logoutBtn = '.dropdown-item > span:contains("Logout")';
    this.labelsSA = ".side-label";
    this.managerView = 'button:contains("Manager View")';
  }

  goto() {
    cy.log("Opening application URL");
    const baseURL = Cypress.config().baseUrl;
    //const sURL = baseURL.concat(componentPath)
    cy.addContextText("TEST CASE STEPS:");
    cy.log(baseURL).addContextText("login to: " + baseURL);
    cy.visit(baseURL);
  }

  logout() {
    cy.get(this.circularBlueChip).should("be.visible").click();
    cy.get(this.logoutBtn).should("be.visible").click();
  }

  getManagerView() {
    return this.managerView;
  }
  getBrandHeader() {
    return this.brandHeader;
  }

  getDashboardViewTabs() {
    return this.dshViewTabs;
  }

  getDashboardProfile() {
    return this.dshProfile;
  }

  getContainTM() {
    return this.containTM;
  }

  getLabelsForSA() {
    return this.labelsSA;
  }
}
