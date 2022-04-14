// @flow

// Capitalize the first letter of a string
export default (string: string) =>
  string.charAt(0).toUpperCase() + string.slice(1);
