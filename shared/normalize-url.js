// @flow

const PROTOCOL = /(http(s?)):\/\//gi;

const addProtocolToString = (string: string) => {
  // if the string starts with http or https, we are good
  if (PROTOCOL.test(string)) {
    return string;
  } else {
    // otherwise it doesn't start with a protocol, prepend http
    return `http://${string}`;
  }
};

export default addProtocolToString;
