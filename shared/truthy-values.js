// @flow
export const getTruthyValuesFromObject = (object: Object): Array<?string> => {
  if (!object) return [];
  try {
    return Object.keys(object).filter(key => object[key] === true);
  } catch (err) {
    return [];
  }
};
