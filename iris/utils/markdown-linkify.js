// @flow
const Linkify = require('linkify-it');

const linkifier = new Linkify(undefined, {
  fuzzyEmail: false,
});

/**
 * Replace URLs in text with markdown links
 * (this is used in a migration script so it has to be Node-compat ES6 only)
 */
const linkify = (text /*: string*/ /*: string*/) => {
  const matches = linkifier.match(text);
  if (!matches) return text;
  let out = text;
  let last = 0;
  const result = [];
  if (matches) {
    matches.forEach(function(match) {
      if (last < match.index) {
        result.push(text.slice(last, match.index));
      }
      result.push(`[${match.text}](${match.url})`);
      last = match.lastIndex;
    });
    if (last < text.length) {
      result.push(text.slice(last));
    }
    out = result.join('');
  }
  return out;
};

module.exports = linkify;
