// @flow
// The Jest configuration
const path = require('path');

module.exports = {
  setupTestFrameworkScriptFile: path.resolve(
    __dirname,
    './shared/testing/setup-test-framework'
  ),
  globalSetup: path.resolve(__dirname, './shared/testing/setup'),
  globalTeardown: path.resolve(__dirname, './shared/testing/teardown'),
  testPathIgnorePatterns: ['/node_modules/', '/mutations/'],
  testURL: 'http://localhost/',
};
