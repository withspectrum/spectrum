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

// Truncate a string nicely to a certain length
function truncate(str /*: string */, length /*: number */) {
  if (str.length <= length) {
    return str;
  }
  var subString = str.substr(0, length);

  // if the title doesn't have any spaces in it, just break at the normal length
  if (subString.indexOf(' ') < 0) return subString + '…';

  // if the title has a space character, attempt to break between words
  return (
    subString.substr(0, subString.lastIndexOf(' ')).replace(/\n/, ' ') + '…'
  );
}

module.exports = truncate;
