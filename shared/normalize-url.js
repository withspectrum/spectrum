// @flow

const STARTS_WITH_PROTOCOL = /^https?:\/\//i;

// Note(@mxstbr): This method assumes that a string passed into it is already verified to be an URL
// it'll just append https:// to anything that doesn't look like an URL
const addProtocolToString = (url: string) => {
  if (STARTS_WITH_PROTOCOL.test(url)) {
    return url;
  } else {
    return `https://${url}`;
  }
};

export default addProtocolToString;
