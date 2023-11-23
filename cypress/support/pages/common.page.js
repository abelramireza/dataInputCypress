export default class Common {
	static LIGHT_MODE = 'Light'
	static DARK_MODE = 'Dark'

	constructor() {
		this.lightMode = '#light'
		this.darkMode = '#dark'
		this.changeModeButton = 'button[title*="Change the background"]'
		this.storyBookIframe = '#storybook-preview-iframe'
		this.fullScreenTab = 'a[href*="iframe.html"]'
		this.fullScreenButton = 'button[title*="full screen"]'
		this.resetControls = 'button[title*="Reset controls"]'
		this.dismissNotification = 'button[title*="Dismiss notification"]'
	}

	getStoryBookIframeLocator() {
		return this.storyBookIframe
	}

	clickChangeMode() {
		cy.get(this.changeModeButton).click()
	}

	clickDarkMode() {
		cy.get(this.darkMode).should('be.visible').click()
	}

	clickLightkMode() {
		cy.get(this.lightMode).should('be.visible').click()
	}

	fullScreenMode() {
		cy.get(this.fullScreenButton).click()
	}

	clickResetControls() {
		cy.get(this.resetControls).click()
	}

	openCanvas(){
		cy.get(this.fullScreenTab).invoke('attr', 'target', '_self').click()
	}

    clickDismissNotificationSB(){
        cy.elementExists(this.dismissNotification).then((confirmDismiss) => {
            if(confirmDismiss) {
                cy.wrap(confirmDismiss).click();
            }
        });
    }



	daysBetweenTodayAndLastFriday() {
		// Get today's date
		const today = new Date();
	  
		// Get the current day of the week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
		const currentDayOfWeek = today.getDay();
	  
		// Calculate the number of days to subtract to reach the last Friday
		const daysToSubtract = (currentDayOfWeek + 2) % 7;
	  
		// Calculate the date of the last Friday
		const lastFriday = new Date(today);
		lastFriday.setDate(today.getDate() - daysToSubtract);
	  
		// Calculate the number of days between today and last Friday
		const timeDifference = today.getTime() - lastFriday.getTime();
		const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
	  
		return daysDifference;
	  }
	  
}
