'use strict';

class DataHelper {
  generateValidCombination (winCombination) {
    const lineLength = 5;
    const countToAdd = lineLength - winCombination.length;
    if (countToAdd > 0) {
      const numbers = Math.random().toString().split(winCombination[0]).join('').substr(2, countToAdd);
      const position = Math.floor(Math.random() * lineLength);
      return numbers.substr(0, position) + winCombination + numbers.substr(position);
    }
    return winCombination;
  }
}

module.exports = new DataHelper();
