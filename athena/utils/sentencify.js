// @flow
type Options = {
  max?: number,
  overflowPostfix?: string,
};

const defaultOptions = {
  max: 3,
  overflowPostfix: ' and others',
};

const LAST_COMMA = /,(?=[^,]*$)/;
// Sentencify an array of strings
export default (
  strings: Array<string>,
  { max, overflowPostfix }: Options = defaultOptions
) => {
  // If we have more than three strings, only take the first 4
  const list = max && strings.length > max ? strings.slice(0, max) : strings;
  // ['Max Stoiber', 'Bryn Lovin', 'Bryn Jackson']
  // => 'Max Stoiber, Brian Lovin, Bryn Jackson'
  const sentence = list.join(', ');
  if (strings.length <= 1) return sentence;
  if (max && overflowPostfix && strings.length > max)
    return sentence + overflowPostfix;
  return sentence.replace(LAST_COMMA, ' and');
};
