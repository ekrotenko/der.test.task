'use strict';
const WebElementHelper = require(`${projectDir}/helpers/web.element.helper`);

class TestGamble {
  constructor () {
    this.gameResults = $$('.notch2');
    this.testDataField = $('#testdata');
    this.currentBalance = $('#balance-value');
    this.spinButton = $('#spinButton');
    this.winbox = $('#winbox');
  }

  async open () {
    const url = htmlPages.testTask;
    await browser.get(url);
  }

  async getResult () {
    return this.gameResults.getText();
  }

  async setPatternValue (pattern) {
    await browser.executeScript('arguments[0].value = arguments[1];', this.testDataField, pattern);
  }

  async getCurrentBalance () {
    const currentBalance = await this.currentBalance.getAttribute('value');

    return parseFloat(currentBalance);
  }

  async spin () {
    await this.waitForSpinButtonEnabled();
    await this.spinButton.click();
  }

  async getWinMessage () {
    await ptorHelper.waitForElement(this.winbox, 1000);

    return this.winbox.getText();
  }

  async isWinboxDisplayed () {
    return this.winbox.isDisplayed();
  }

  async getBlinkedCharacters () {
    return (await $$('.blinkme.notch2').getText()).join('');
  }

  async isSpinButtonEnabled () {
    return this.spinButton.isEnabled();
  }

  async waitForSpinButtonEnabled () {
    await WebElementHelper.waitForElementEnabled(this.spinButton);
  }

  async isWinAchieved (combination) {
    return WebElementHelper.hasClass($(`.win${combination}`), 'achievement');
  }

  async setBalance (value) {
    await this.currentBalance.clear();
    await this.currentBalance.sendKeys(value);
  }
}

module.exports = new TestGamble();
