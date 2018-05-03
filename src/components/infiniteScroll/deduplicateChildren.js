// @flow
export const deduplicateChildren = (
  array: Array<any>,
  prop: string
): Array<any> => {
  if (!array || !Array.isArray(array) || array.length === 0) return array;

  return array.filter((obj, pos, arr) => {
    return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos;
  });
};
