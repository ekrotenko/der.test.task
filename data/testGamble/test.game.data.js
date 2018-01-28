const winCombinations = [
  {combination: '111', winAmount: 60},
  {combination: '1111', winAmount: 80},
  {combination: '11111', winAmount: 100},
  {combination: '222', winAmount: 120},
  {combination: '2222', winAmount: 160},
  {combination: '22222', winAmount: 200},
  {combination: '333', winAmount: 180},
  {combination: '3333', winAmount: 240},
  {combination: '33333', winAmount: 300},
  {combination: '444', winAmount: 240},
  {combination: '4444', winAmount: 320},
  {combination: '44444', winAmount: 400},
  {combination: '555', winAmount: 300},
  {combination: '5555', winAmount: 400},
  {combination: '55555', winAmount: 500}
];

module.exports = {
  winMessage: winAmount => `Win ${winAmount} coins`,
  winCombinations,
  zeroBalance: 0,
  initialAchievementsCount: 0,
  emptyPattern: '',
  initialBalance: 1000,
  gameCost: 1,
  spinAmount: 10
};
