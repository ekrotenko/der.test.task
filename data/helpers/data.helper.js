'use strict';

/**
 * Generate expected combination of numbers from win combination and random missing digits,
 * putting win combination to the random position
 * @param winCombination - winning combination of digits
 * @returns {*}
 */
function generateExpectedCombination(winCombination) {
  const lineLength = 5;
  const countToAdd = lineLength - winCombination.length;
  if (countToAdd > 0) {
    const numbers = Math.random().toString().split(winCombination[0]).join('').substr(2, countToAdd);
    const position = Math.floor(Math.random() * lineLength);
    return numbers.substr(0, position) + winCombination + numbers.substr(position);
  }
  return winCombination;
}

module.exports = {
  generateExpectedCombination
};
