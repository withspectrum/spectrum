// @flow

// Add commas to numbers
export default (num: number) =>
  num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
