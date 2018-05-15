// @flow
export const getTruthyValuesFromObject = (object: Object): Array<?string> => {
  return Object.keys(object).filter(key => object[key] === true);
};
