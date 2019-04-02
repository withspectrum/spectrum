// @flow
export const getStringElements = (arr: Array<mixed>): Array<string> => {
  return arr
    .map(elem => {
      if (!elem) return null;
      if (Array.isArray(elem)) return getStringElements(elem);
      if (typeof elem === 'string') return elem;
      // Handle React elements being passed as array elements
      // $FlowIssue
      if (elem.props && elem.props.children)
        return getStringElements(elem.props.children);
      return null;
    })
    .filter(Boolean)
    .reduce((final, elem) => {
      if (Array.isArray(elem)) return [...final, ...elem];
      return [...final, elem];
    }, []);
};
