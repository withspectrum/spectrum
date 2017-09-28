/**
 * This file is shared between server and client.
 * ⚠️ DON'T PUT ANY NODE.JS OR BROWSER-SPECIFIC CODE IN HERE ⚠️
 *
 * Note: This uses Flow comment syntax so this whole file is actually valid JS without any transpilation
 * The reason I did that is because create-react-app doesn't transpile files outside the source folder,
 * so it chokes on the Flow syntax.
 * More info: https://flow.org/en/docs/types/comments/
 */

var MS_PER_SECOND = 1000;
var MS_PER_MINUTE = 60000;
var MS_PER_HOUR = 3600000;
var MS_PER_DAY = 86400000;
var MS_PER_YEAR = 31536000000;

function timeDifferenceShort(current /*: Date*/, previous /*: Date*/) {
  var elapsed = current - previous;

  if (elapsed < MS_PER_MINUTE) {
    return Math.round(elapsed / MS_PER_SECOND) + 's';
  } else if (elapsed < MS_PER_HOUR) {
    return Math.round(elapsed / msPerMinute) + 'm';
  } else if (elapsed < MS_PER_DAY) {
    return Math.round(elapsed / MS_PER_HOUR) + 'h';
  } else if (elapsed < MS_PER_YEAR) {
    return Math.round(elapsed / MS_PER_DAY) + 'd';
  } else {
    return Math.round(elapsed / MS_PER_YEAR) + 'y';
  }
}

module.exports = {
  short: timeDifferenceShort,
};
