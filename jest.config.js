// @flow
// The Jest configuration
const path = require('path');

module.exports = {
  setupTestFrameworkScriptFile: path.resolve(__dirname, './src/setupTests.js'),
  testPathIgnorePatterns:
    process.env.E2E || process.env.CI
      ? ['/node_modules/', '/mobile/']
      : ['/node_modules/', '/mobile/', '/test-e2e/'],
};
