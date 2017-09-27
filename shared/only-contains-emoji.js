/**
 * This file is shared between server and client.
 * ⚠️ DON'T PUT ANY NODE.JS OR BROWSER-SPECIFIC CODE IN HERE ⚠️
 *
 * Note: This uses Flow comment syntax so this whole file is actually valid JS without any transpilation
 * The reason I did that is because create-react-app doesn't transpile files outside the source folder,
 * so it chokes on the Flow syntax.
 * More info: https://flow.org/en/docs/types/comments/
 */
var createEmojiRegex = require('emoji-regex');

// This regex matches every string with any emoji in it, not just strings that only have emojis
var originalEmojiRegex = createEmojiRegex();

// Make sure we match strings that _only_ contain emojis (and whitespace)
var regex = new RegExp(
  '^(' + originalEmojiRegex.toString().replace(/\/g$/, '') + '|\\s)+$'
);

function onlyContainsEmoji(text /*: string */) /*: string */ {
  return regex.test(text);
}

module.exports = onlyContainsEmoji;
