// @flow
export const getTruthyValuesFromObject = (object?: Object): Array<?string> => {
  if (!object) return [];
  return (
    Object.keys(object)
      .filter(Boolean)
      // $FlowIssue
      .filter(key => object[key] === true)
  );
};
