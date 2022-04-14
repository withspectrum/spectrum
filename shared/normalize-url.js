// @flow

// Taken from @braintree/sanitize-url
const invalidPrototcolRegex = /^(%20|\s)*(javascript|data)/im;
const ctrlCharactersRegex = /[^\x20-\x7E]/gim;
const urlSchemeRegex = /^([^:]+):/gm;
const relativeFirstCharacters = ['.', '/'];
const STARTS_WITH_PROTOCOL = /^https?:\/\//i;

function isRelativeUrl(url) {
  return relativeFirstCharacters.indexOf(url[0]) > -1;
}

function sanitizeUrl(url) {
  var urlScheme, urlSchemeParseResults;
  var sanitizedUrl = url.replace(ctrlCharactersRegex, '');

  if (isRelativeUrl(sanitizedUrl)) {
    return sanitizedUrl;
  }

  urlSchemeParseResults = sanitizedUrl.match(urlSchemeRegex);

  if (!urlSchemeParseResults) {
    return sanitizedUrl;
  }

  urlScheme = urlSchemeParseResults[0];

  if (invalidPrototcolRegex.test(urlScheme)) {
    return 'about:blank';
  }

  return sanitizedUrl;
}

// Note(@mxstbr): This method assumes that a string passed into it is already verified to be an URL
// it'll just append https:// to anything that doesn't look like an URL
const addProtocolToString = (url: string) => {
  const sanitized = sanitizeUrl(url);
  if (sanitized === 'about:blank') return sanitized;

  if (STARTS_WITH_PROTOCOL.test(url)) {
    return sanitized;
  } else {
    return `https://${sanitized}`;
  }
};

export default addProtocolToString;
