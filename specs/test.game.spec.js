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
  });

  describe('with random flow', () => {
    it(`should reduce balance on ${testData.gameCost} coin after spin`, async () => {
      expectedBalance = await testGamblePage.getCurrentBalance() - testData.gameCost;
      await testGamblePage.spin();

      expect(expectedBalance)
        .toBe(await testGamblePage.getCurrentBalance(), `Balance was note reduced on ${testData.gameCost} coin`);
    });

    it(`should not repeat previous result`, async () => {
      await testGamblePage.spin();
      const previousResult = await testGamblePage.getSpinResult();
      await testGamblePage.waitForSpinButtonEnabled();
      await testGamblePage.spin();

      expect(await testGamblePage.getSpinResult()).not.toBe(previousResult, 'Random result matches previous one');
    });
  });

  for (let data of testData.winCombinations) {
    describe(`with win combination ${data.combination}`, () => {
      let currentBalance;
      let pattern = dataHelper.generateValidCombination(data.combination);

      it(`should increase balance on ${data.winAmount} coins`, async () => {
        currentBalance = await testGamblePage.getCurrentBalance();
        expectedBalance = currentBalance - testData.gameCost + data.winAmount;

        await testGamblePage.setPatternValue(pattern);
        await testGamblePage.spin();

        expect(expectedBalance)
          .toBe(await testGamblePage.getCurrentBalance(),
            `Balance was not increased on ${data.winAmount} coins for '${pattern}'`);
      });

      it(`should display win message with ${data.winAmount} amount`, async () => {
        expect(await testGamblePage.isWinboxDisplayed()).toBeTruthy('Winbox is not displayed');
        expect(await testGamblePage.getWinMessage())
          .toBe(testData.winMessage(data.winAmount), 'Win message content is incorrect');
      });

      it(`should blink '${data.combination}' combination in '${pattern}' line`, async () => {
        expect(await testGamblePage.getBlinkedCharacters())
          .toBe(data.combination, `Matching ${data.combination} does not blink in '${pattern}' line`);
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
      await testGamblePage.setPatternValue(testData.emptyPattern);
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
