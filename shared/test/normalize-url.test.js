// @flow
import normalizeUrl from '../normalize-url';

type Input = string;
type Output = string;

// If only Input is provided it tests for input === output
type TestCase = [Input, Output];

type TestCases = {
  [testName: string]: TestCase,
};

const testCases: TestCases = {
  'should do nothing to https URLs': [
    'https://github.com',
    'https://github.com',
  ],
  'should do nothing to http URLs': ['http://github.com', 'http://github.com'],
  'should add https:// in front of URLs without protocol': [
    'github.com',
    'https://github.com',
  ],
  'should block malicious links': [
    'javascript:alert(document.cookie)',
    'about:blank',
  ],
};

Object.keys(testCases).forEach(name => {
  it(name, () => {
    expect(normalizeUrl(testCases[name][0])).toEqual(testCases[name][1]);
  });
});
