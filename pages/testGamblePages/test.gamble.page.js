'use strict';
const webElementHelper = require(`${projectDir}/helpers/web.element.helper`);

class TestGamblePage {
  constructor () {
    this._testDataField = $('#testdata');
    this._currentBalance = $('#balance-value');
    this._spinButton = $('#spinButton');
    this._winBox = $('#winbox');
  }

  static async open (fileName = 'Test_Task.html') {
    await browser.get(fileName);

    return new TestGamblePage();
  }

  async setPatternValue (pattern) {
    await browser.executeScript('arguments[0].value = arguments[1];', this._testDataField, pattern);
  }

  async getCurrentBalance () {
    const curBalance = await this._currentBalance.getAttribute('value');

    return parseFloat(curBalance);
  }

  async spin () {
    await this.waitForSpinButtonEnabled();
    await this._spinButton.click();
  }

  async getWinMessage () {
    await ptorHelper.waitForElement(this._winBox, 1000);

    return this._winBox.getText();
  }

  async isWinboxDisplayed () {
    return this._winBox.isDisplayed();
  }

  async getBlinkedCharacters () {
    return (await $$('.blinkme.notch2').getText()).join('');
  }

  async isSpinButtonEnabled () {
    return this._spinButton.isEnabled();
  }

  async waitForSpinButtonEnabled () {
    await webElementHelper.waitForElementEnabled(this._spinButton);
  }

  async isWinAchieved (combination) {
    return webElementHelper.hasClass($(`.win${combination}`), 'achievement');
  }

  async setBalance (value) {
    await this._currentBalance.clear();
    await this._currentBalance.sendKeys(value);
  }
}

module.exports = TestGamblePage;
