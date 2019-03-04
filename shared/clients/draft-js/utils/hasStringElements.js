//@flow
export const hasStringElements = (arr: Array<mixed> | mixed) => {
  if (Array.isArray(arr)) return arr.some(elem => hasStringElements(elem));

  return typeof arr === 'string';
};
