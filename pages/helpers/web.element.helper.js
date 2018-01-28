'use strict';
const EC = protractor.ExpectedConditions;

/**
 * Waits for element state becomes enabled
 * @param webElement - element state of which is expected
 * @param timeout - time interval in ms
 * @returns {Promise.<void>}
 */
async function waitForElementEnabled(webElement, timeout = browser.params.waitTimeout) {
  await browser.driver.wait(EC.elementToBeClickable(webElement), timeout);
}

/**
 * Check whether element contains class name
 * @param webElement - element which is checked
 * @param className - expected class name
 * @returns {Promise.<boolean>} true if element contains expected class name
 */
async function hasClass(webElement, className) {
  const classes = await webElement.getAttribute('class');

  return classes.split(' ').indexOf(className) !== -1;
}

module.exports = {
  waitForElementEnabled,
  hasClass
};
