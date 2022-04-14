// @flow
export const formatNumbersToDollars = (amount: number): string =>
  (amount / 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
