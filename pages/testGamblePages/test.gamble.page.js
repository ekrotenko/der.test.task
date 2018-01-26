'use strict';
const webElementHelper = require(`${projectDir}/pages/helpers/web.element.helper`);

class TestGamblePage {
  constructor() {
    this._testDataField = $('#testdata');
    this._currentBalance = $('#balance-value');
    this._spinButton = $('#spinButton');
    this._winBox = $('#winbox');
    this._paytable = $('#paytable tbody');
    this._spinResult = $$('.notch2');
  }

  static async open(fileName = 'Test_Task.html') {
    await browser.get(fileName);

    return new TestGamblePage();
  }

  async setPatternValue(pattern) {
    await browser.executeScript('arguments[0].value = arguments[1];', this._testDataField, pattern);
  }

  async getCurrentBalance() {
    const curBalance = await this._currentBalance.getAttribute('value');

    return parseFloat(curBalance);
  }

  async spin() {
    await this.waitForSpinButtonEnabled();
    await this._spinButton.click();
  }

  async getWinMessage() {
    await ptorHelper.waitForElement(this._winBox, 1000);

    return await this._winBox.getText();
  }

  async isWinboxDisplayed() {
    return await this._winBox.isDisplayed();
  }

  async getBlinkedCharacters() {
    return (await $$('.blinkme.notch2').getText()).join('');
  }

  async isSpinButtonEnabled() {
    return await this._spinButton.isEnabled();
  }

  async waitForSpinButtonEnabled() {
    await webElementHelper.waitForElementEnabled(this._spinButton);
  }

  async isWinAchieved(combination) {
    return await webElementHelper.hasClass($(`.win${combination}`), 'achievement');
  }

  async setBalance(value) {
    await this._currentBalance.clear();
    await this._currentBalance.sendKeys(value);
  }

  async getPaytableData() {
    const payLines = this._paytable.$$('tr');

    return payLines.map(async row => {
      const rowFields = row.$$('td');
      return {
        combination: (await rowFields.first().getText()).split(' + ').join(''),
        winAmount: parseFloat(await rowFields.last().getText())
      };
    });
  }

  async getAchievedResults() {
    return await this._paytable.$$('.achievement').getText();
  }

  async getSpinResult() {
    return (await this._spinResult.getText()).join();
  }
}

module.exports = TestGamblePage;
