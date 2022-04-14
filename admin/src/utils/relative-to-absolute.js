// @flow

// Convert an array of relative growth numbers to an array of absolute ones
// [1, 2, 3, 1] => [1, 3, 6, 7]
const relativeToAbsolute = (input: Array<number>): Array<number> =>
  input.reduce(
    (arr, val) => {
      return arr.concat([arr[arr.length - 1] + val]);
    },
    [input[0]]
  );

export default relativeToAbsolute;
