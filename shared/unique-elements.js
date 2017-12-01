// @flow
// Get unique elements in an array, even if they're complex like nested arrays or objects
// NOTE: Uses ES6 Set, so DO NOT USE on the frontend

const unique = (array: Array<mixed>): Array<mixed> => {
  if (array.length <= 1) return array;

  // Turn all elements into strings, including arrays
  const stringElements = array.map(key => JSON.stringify(key));

  // Get the unique elements by using an ES6 Set
  const uniqueElements = [...new Set(stringElements)];

  // Turn the non-string elements back into non-strings
  return uniqueElements.map(key => {
    // If it's e.g. an array, this will return the original array
    try {
      return JSON.parse(key);
    } catch (err) {
      // Oh, it was a string after all, let's just return that.
      return key;
    }
  });
};

export default unique;
