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

function sortByDate(
  array /*: Array<number> */,
  key /*: string */,
  order /*: string */
) {
  return array.sort(function(a, b) {
    var x = new Date(a[key]).getTime();
    var y = new Date(b[key]).getTime();
    // desc = older to newest from top to bottom
    var val = order === 'desc' ? y - x : x - y;
    return val;
  });
}

module.exports = sortByDate;
