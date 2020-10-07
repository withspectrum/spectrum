// @flow

// Convert an array of relative growth numbers to an array of absolute ones
// [1, 2, 3, 1] => [1, 3, 6, 7]
const relativeToAbsolute = (input: Array<number>): Array<number> => input.map((sum => value => sum += value)(0));

export default relativeToAbsolute;
