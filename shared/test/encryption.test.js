// @flow
import {
  encryptString,
  decryptString,
  encryptObject,
  decryptObject,
} from '../encryption';

const inputString = 'this should be encrypted';
const inputObject = { foo: 'bar', biz: 'baz' };

it('should encrypt and decrypt a string', () => {
  const encrypted = encryptString(inputString);
  const decrypted = decryptString(encrypted);

  expect(encrypted).not.toEqual(inputString);
  expect(decrypted).toEqual(inputString);
  expect(typeof decrypted).toEqual('string');
  expect(typeof encrypted).toEqual('string');
});

it('should encrypt and decrypt a object', () => {
  const encrypted = encryptObject(inputObject);
  const decrypted = decryptObject(encrypted);

  expect(encrypted).not.toEqual(inputObject);
  expect(decrypted).toEqual(inputObject);
  expect(typeof decrypted).toEqual('object');
  expect(typeof encrypted).toEqual('string');
});
