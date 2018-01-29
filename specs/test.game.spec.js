const TestGamblePage = require(`${projectDir}/pages/testGamblePages/test.gamble.page`);
const dataHelper = require(`${projectDir}/data/helpers/data.helper`);

const testData = require(`${projectDir}/data/testGamble/test.game.data`);

describe('Test gamble', () => {
  let expectedBalance;
  let testGamblePage;

  beforeAll(async () => {
    testGamblePage = await TestGamblePage.open();
  });

  describe('initial state', () => {
    it('should contain correct initial balance', async () => {
      expect(await testGamblePage.getCurrentBalance()).toBe(testData.initialBalance, 'Initial balance is incorrect');
    });

    it('should contain spin button enabled', async () => {
      expect(await testGamblePage.isSpinButtonEnabled()).toBeTruthy('Spin button is disabled');
    });

    it('should contain correct specified paytable data', async () => {
      expect(await testGamblePage.getPaytableData()).toEqual(testData.winCombinations, 'Paytable data is incorrect');
    });

    it('should not contain any achieved results in paytable', async () => {
      expect((await testGamblePage.getAchievedResults()).length)
        .toBe(testData.initialAchievementsCount, 'Some paytable records are achieved');
    });

    it(`should not generate same sequences of results on load`, async () => {
      const beforeRefresh = await testGamblePage.getListOfSpinResults(testData.spinAmount);
      await TestGamblePage.open();
      const afterRefresh = await testGamblePage.getListOfSpinResults(testData.spinAmount);

      expect(beforeRefresh).not.toBe(afterRefresh, 'Random result matches previous one');
    });
  });

  for (let data of testData.winCombinations) {
    describe(`with winning combination ${data.combination}`, () => {
      let currentBalance;
      let expectedCombination = dataHelper.generateExpectedCombination(data.combination);

      it(`should increase balance on ${data.winAmount} coins`, async () => {
        currentBalance = await testGamblePage.getCurrentBalance();
        expectedBalance = currentBalance - testData.gameCost + data.winAmount;

        await testGamblePage.setExpectedCombination(expectedCombination);
        await testGamblePage.spin();

        expect(expectedBalance)
          .toBe(await testGamblePage.getCurrentBalance(),
            `Balance was not increased on ${data.winAmount} coins for '${expectedCombination}'`);
      });

      it(`should display win message with ${data.winAmount} amount`, async () => {
        expect(await testGamblePage.isWinboxDisplayed()).toBeTruthy('Winbox is not displayed');
        expect(await testGamblePage.getWinMessage())
          .toBe(testData.winMessage(data.winAmount), 'Win message content is incorrect');
      });

      it(`should blink '${data.combination}' combination in '${expectedCombination}' line`, async () => {
        expect(await testGamblePage.getBlinkedCharacters())
          .toBe(data.combination, `Matching ${data.combination} does not blink in '${expectedCombination}' line`);
      });

      it(`should disable spin button`, async () => {
        expect(await testGamblePage.isSpinButtonEnabled()).toBeFalsy('Spin button is enabled');
      });

      it(`should mark combination as achieved`, async () => {
        expect(await testGamblePage.isWinAchieved(data.combination))
          .toBeTruthy('Combination is not marked as achieved in paytable');
      });
    });
  }

  describe('with zero balance', () => {
    beforeAll(async () => {
      await testGamblePage.waitForSpinButtonEnabled();
      await testGamblePage.setExpectedCombination(testData.emptyPattern);
      await testGamblePage.setBalance(testData.zeroBalance);
    });

    it('should disable spin button', async () => {
      expect(await testGamblePage.isSpinButtonEnabled()).toBeFalsy('Spin button is enabled');
    });

    it('should not go to negative balance after spin', async () => {
      await testGamblePage.spin();

      expect(await testGamblePage.getCurrentBalance())
        .not.toBeLessThan(testData.zeroBalance, 'Balance becomes less than 0 after spin');
    });
  });
});
