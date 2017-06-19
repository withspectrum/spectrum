// @flow

/**
 * Encode a string to base64 (using the Node built-in Buffer)
 *
 * Stolen from http://stackoverflow.com/a/38237610/2115623
 */
export const encode = (string: string) =>
  Buffer.from(string).toString('base64');

type Base64String = string;
/**
 * Decode a base64 string (using the Node built-in Buffer)
 *
 * Stolen from http://stackoverflow.com/a/38237610/2115623
 */
export const decode = (string?: Base64String) =>
  (string ? Buffer.from(string, 'base64').toString('ascii') : '');
