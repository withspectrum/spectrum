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
  let newText = text;
  // Replace each URL match with a markdown URL
  matches.forEach(match => {
    newText = `${newText.substr(0, match.index)}[${match.text}](${match.url})${newText.substr(match.lastIndex)}`;
  });
  return newText;
};

module.exports = linkify;
