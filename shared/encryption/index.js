// @flow
require('now-env');
var Crypto = require('crypto-js');

var ENCRYPTION_KEY =
  process.env.NODE_ENV === 'development'
    ? 'abcdefghijklmnopqrstuvwxyzasdfjk'
    : process.env.ENCRYPTION_KEY; // Must be 256 bytes (32 characters)

if (!ENCRYPTION_KEY) {
  throw new Error(
    'Looks like youre missing an encryption key for sensitive data!'
  );
}

function encryptString(text /*: string */) /*: string */ {
  return Crypto.AES.encrypt(text, ENCRYPTION_KEY);
}

function decryptString(text /*: string */) /*: string */ {
  var bytes = Crypto.AES.decrypt(text, ENCRYPTION_KEY);
  var plaintext = bytes.toString(Crypto.enc.Utf8);

  return plaintext;
}

function encryptObject(object /*: Object */) /*: Object */ {
  return Crypto.AES.encrypt(JSON.stringify(object), ENCRYPTION_KEY);
}

function decryptObject(text /*: string */) /*: Object */ {
  var bytes = Crypto.AES.decrypt(text.toString(), ENCRYPTION_KEY);
  var decryptedObject = JSON.parse(bytes.toString(Crypto.enc.Utf8));

  return decryptedObject;
}

module.exports = { decryptString, encryptString, decryptObject, encryptObject };
