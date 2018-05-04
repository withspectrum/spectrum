// @flow
require('now-env');
var crypto = require('crypto');

var ENCRYPTION_KEY = process.env.ENCRYPTION_KEY; // Must be 256 bytes (32 characters)
var IV_LENGTH = 16; // For AES, this is always 16

function encrypt(text /*: string */) /*: string */ {
  if (!text || text.length === 0) return text;

  var iv = crypto.randomBytes(IV_LENGTH);

  var cipher = crypto.createCipheriv(
    'aes-256-cbc',
    // $FlowFixMe
    new Buffer(ENCRYPTION_KEY),
    iv
  );
  // $FlowFixMe
  var encrypted = cipher.update(text);

  encrypted = Buffer.concat([encrypted, cipher.final()]);

  return iv.toString('hex') + ':' + encrypted.toString('hex');
}

function decrypt(text /*: string */) /*: string */ {
  if (!text || text.length === 0) return text;

  var textParts = text.split(':');
  var iv = new Buffer(textParts.shift(), 'hex');
  var encryptedText = new Buffer(textParts.join(':'), 'hex');

  var decipher = crypto.createDecipheriv(
    'aes-256-cbc',
    // $FlowFixMe
    new Buffer(ENCRYPTION_KEY),
    iv
  );
  var decrypted = decipher.update(encryptedText);

  decrypted = Buffer.concat([decrypted, decipher.final()]);

  return decrypted.toString();
}

module.exports = { decrypt, encrypt };
