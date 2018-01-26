const TestGamblePage = require(`${projectDir}/pages/testGamblePages/test.gamble.page`);
const dataHelper = require(`${projectDir}/helpers/data.helper`);

const testData = require(`${projectDir}/data/testGamble/test.game.data`);

describe('Test gamble', () => {
  let expectedBalance;
  let testGamblePage;

  beforeAll(async () => {
    testGamblePage = await TestGamblePage.open();
  });

  it('should reduce balance on 1 coin after spin', async () => {
    expectedBalance = await testGamblePage.getCurrentBalance() - 1;
    await testGamblePage.spin();

    expect(expectedBalance).toBe(await testGamblePage.getCurrentBalance(), 'Balance was note reduced on 1 coin');
  });

  using(testData.winCombinations, (winAmount, combination) => {
    describe(`with win combination ${combination}`, () => {
      let currentBalance;
      let pattern = dataHelper.generateValidCombination(combination);

      it(`should increase balance on ${winAmount} coins`, async () => {
        currentBalance = await testGamblePage.getCurrentBalance();
        expectedBalance = currentBalance - 1 + winAmount;

        await testGamblePage.setPatternValue(pattern);
        await testGamblePage.spin();

        expect(expectedBalance)
          .toBe(await testGamblePage.getCurrentBalance(),
            `Balance was not increased on ${winAmount} coins for '${pattern}'`);
      });

      it(`should display win message with ${winAmount} amount`, async () => {
        expect(await testGamblePage.isWinboxDisplayed()).toBeTruthy('Winbox is not displayed');
        expect(await testGamblePage.getWinMessage())
          .toBe(testData.winMessage.replace('#', winAmount), 'Win message content is incorrect');
      });

      it(`should blink '${combination}' combination in '${pattern}' line`, async () => {
        expect(await testGamblePage.getBlinkedCharacters())
          .toBe(combination, `Matching ${combination} does not blink in '${pattern}' line`);
      });

      it(`should disable spin button`, async () => {
        expect(await testGamblePage.isSpinButtonEnabled()).toBeFalsy('Spin button is enabled');
      });

      it(`should mark combination as achieved`, async () => {
        expect(await testGamblePage.isWinAchieved(combination))
          .toBeTruthy('Combination is not marked as achieved in paytable');
      });
    });
  });

  it('should not go to negative balance', async () => {
    await testGamblePage.setPatternValue(testData.emptyPattern);
    await testGamblePage.setBalance(testData.zeroBalance);
    await testGamblePage.spin();

    expect(await testGamblePage.getCurrentBalance()).not.toBeLessThan(testData.zeroBalance);
  });
});
