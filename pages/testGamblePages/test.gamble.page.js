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

  /**
   * Opens the html file of game in browser
   * @param fileName - name of html file of the game from htmlTestPages folder
   * @returns {Promise.<TestGamblePage>} instance of TestGamblePage
   */
  static async open(fileName = 'Test_Task.html') {
    await browser.get(fileName);

    return new TestGamblePage();
  }

  /**
   * Set the expected combination to the test data field
   * @param combination
   * @returns {Promise.<void>}
   */
  async setExpectedCombination(combination) {
    await browser.executeScript('arguments[0].value = arguments[1];', this._testDataField, combination);
  }

  /**
   * Get value of current balance
   * @returns {Promise.<Number>} current balance
   */
  async getCurrentBalance() {
    const curBalance = await this._currentBalance.getAttribute('value');

    return parseFloat(curBalance);
  }

  /**
   * Spins the slots
   * @returns {Promise.<void>}
   */
  async spin() {
    await this.waitForSpinButtonEnabled();
    await this._spinButton.click();
  }

  /**
   * Get the message in win case
   * @returns {Promise.<string>} win message
   */
  async getWinMessage() {
    await ptorHelper.waitForElement(this._winBox, 1000);

    return await this._winBox.getText();
  }

  /**
   * Check whether winbox is displayed
   * @returns {Promise.<boolean>} true if winbox is displayed
   */
  async isWinboxDisplayed() {
    return await this._winBox.isDisplayed();
  }

  /**
   * Get sequence of blinked characters in result line
   * @returns {Promise.<string>} blinked characters joined to string
   */
  async getBlinkedCharacters() {
    return (await $$('.blinkme.notch2').getText()).join('');
  }

  /**
   * Check spin button enabled state
   * @returns {Promise.<boolean>} true if spin button enabled
   */
  async isSpinButtonEnabled() {
    return await this._spinButton.isEnabled();
  }

  /**
   * Waits for spin button becomes enabled
   * @returns {Promise.<void>}
   */
  async waitForSpinButtonEnabled(timeout = browser.params.waitTimeout) {
    await webElementHelper.waitForElementEnabled(this._spinButton, timeout);
  }

  /**
   * Check whether specified row in paytable marked as achieved
   * @param combination - combination which should be checked
   * @returns {Promise.<boolean>} true, if winning row is marked as achieved
   */
  async isWinAchieved(combination) {
    return await webElementHelper.hasClass($(`.win${combination}`), 'achievement');
  }

  /**
   * Set balance
   * @param value - amount of coins
   * @returns {Promise.<void>}
   */
  async setBalance(value) {
    await this._currentBalance.clear();
    await this._currentBalance.sendKeys(value);
  }

  /**
   * Get data from the paytable
   * @returns {Promise<wdpromise.Promise<any[]>>} array of objects {combination, winAmount}
   */
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

  /**
   * Get list of the achieved wins from the paytable
   * @returns {Promise.<Array>} 'combination/win amount marked as achieved
   */
  async getAchievedResults() {
    return await this._paytable.$$('.achievement').getText();
  }

  /**
   * Get result of spin
   * @returns {Promise.<string>}
   */
  async getSpinResult() {
    return (await this._spinResult.getText()).join();
  }

  /**
   * Get list of game results after specified amount of spins
   * @param amount of spins
   * @returns {Promise.<Array>} spin results
   */
  async getListOfSpinResults(amount) {
    const res = [];
    for (let i = 0; i < amount; i++) {
      await this.spin();
      res.push(await this.getSpinResult());
    }

    return res;
  }
}

module.exports = TestGamblePage;
