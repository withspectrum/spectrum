// @flow
import validateStringAsHexValue from 'shared/validate-string-as-hex-value';

it('should validate string with hash', () => {
  let string = '#f0f0f0';
  let validated = validateStringAsHexValue(string);
  expect(validated).toEqual(string);
});

it('should validate string without hash', () => {
  let string = 'f0f0f0';
  let validated = validateStringAsHexValue(string);
  expect(validated).toEqual(`#${string}`);
});

it('should validate short strings', () => {
  let string = '#f0f';
  let validated = validateStringAsHexValue(string);
  expect(validated).toEqual('#ff00ff');
});

it('should fail strings longer than 6 chars', () => {
  let string = '#f0f0f0f';
  let validated = validateStringAsHexValue(string);
  expect(validated).toEqual(null);
});

it('should fail strings not exactly 3 chars', () => {
  let strings = ['#f', '#f0', '#f00f', '#f000f'];
  let validated = strings.map(s => validateStringAsHexValue(s));
  expect(validated.filter(Boolean).length).toEqual(0);
});

it('should fail invalid hex values', () => {
  let strings = ['#jpy', '#f0r', '#lmnopq', 'fffffu'];
  let validated = strings.map(s => validateStringAsHexValue(s));
  expect(validated.filter(Boolean).length).toEqual(0);
});
