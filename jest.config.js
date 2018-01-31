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
  testPathIgnorePatterns:
    process.env.E2E || process.env.CI
      ? ['/node_modules/', 'iris/*/mutations/', '/mobile/']
      : ['/node_modules/', 'iris/*/mutations/', '/mobile/', '/test-e2e/'],
};
