/**
 * @flow
 */
const path = require('path');

const E2E_DETOX_CONFIG = {
  /**
   * Setups Detox environment
   */
  setupTestFrameworkScriptFile: path.resolve(__dirname, './setupTests'),
  /**
   * To keep it closer to default Jest test patterns, we look for __e2e__
   * folders. This is similar to __tests__, where unit tests can be located
   */
  testMatch: ['**/__e2e__/**/*.js'],
};

const CONFIG = {
  preset: 'react-native',
  testPathIgnorePatterns: ['__e2e__', 'node_modules'],
};

module.exports = process.env.E2E ? E2E_DETOX_CONFIG : CONFIG;
