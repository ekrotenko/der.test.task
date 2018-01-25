'use strict';
const EC = protractor.ExpectedConditions;

class WebElementHelper {
    async waitForElementEnabled(webElement, timeout = browser.params.waitTimeout) {
        await browser.driver.wait(EC.elementToBeClickable(webElement), timeout);
    }

    async hasClass(webElement, className) {
        const classes = await webElement.getAttribute('class');

        return classes.split(' ').indexOf(className) !== -1;
    }
}

module.exports = new WebElementHelper();
