// @flow
/**
 * This file is shared between server and client.
 * ⚠️ DON'T PUT ANY NODE.JS OR BROWSER-SPECIFIC CODE IN HERE ⚠️
 *
 * Note: This uses Flow comment syntax so this whole file is actually valid JS without any transpilation
 * The reason I did that is because create-react-app doesn't transpile files outside the source folder,
 * so it chokes on the Flow syntax.
 * More info: https://flow.org/en/docs/types/comments/
 */
var defaultOptions = {
  max: 3,
  overflowPostfix: ' and others',
};

// Sentencify an array of strings
function sentencify(strings /*: Array<strings> */) /*:strings */ {
  // Get the default options if necessary
  var _ref =
      arguments.length > 1 && arguments[1] !== undefined
        ? arguments[1]
        : defaultOptions,
    max = _ref.max,
    overflowPostfix = _ref.overflowPostfix;

  // If we have more than three strings, only take the first 4
  var list = strings.length > max ? strings.slice(0, max) : strings;
  // ['Max Stoiber', 'Bryn Lovin', 'Bryn Jackson']
  // => 'Max Stoiber, Brian Lovin, Bryn Jackson'
  var sentence = list.join(', ');
  if (strings.length <= 1) return sentence;
  // 'Max Stoiber, Brian Lovin, Bryn Jackson'
  // => 'Max Stoiber, Brian Lovin, Bryn Jackson and others'
  if (strings.length > max) return sentence + overflowPostfix;
  // 'Max Stoiber, Brian Lovin, Bryn Jackson'
  // => 'Max Stoiber, Brian Lovin and Bryn Jackson'
  return sentence.replace(
    ', ' + strings[strings.length - 1],
    ' and ' + strings[strings.length - 1]
  );
}

module.exports = sentencify;
