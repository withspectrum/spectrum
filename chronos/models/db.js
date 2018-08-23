// @flow
/**
 * Database setup is done here
 */
const fs = require('fs');
const path = require('path');
const IS_PROD = !process.env.FORCE_DEV && process.env.NODE_ENV === 'production';

const DEFAULT_CONFIG = {
  // Connect to the test database when, well, testing
  db: !process.env.TEST_DB ? 'spectrum' : 'testing',
  max: 500, // Maximum number of connections, default is 1000
  buffer: 5, // Minimum number of connections open at any given moment, default is 50
  timeoutGb: 60 * 1000, // How long should an unused connection stick around, default is an hour, this is a minute
};

const PRODUCTION_CONFIG = {
  password: process.env.COMPOSE_US_WEST_2_RETHINKDB_PASSWORD,
  user: 'admin',
  host: process.env.COMPOSE_US_WEST_2_RETHINKDB_URL,
  port: process.env.COMPOSE_US_WEST_2_RETHINKDB_PORT,
  ssl: {
    ca: fs.readFileSync(path.join(process.cwd(), 'cacert')),
  },
};

const config = IS_PROD
  ? {
      ...DEFAULT_CONFIG,
      ...PRODUCTION_CONFIG,
    }
  : {
      ...DEFAULT_CONFIG,
    };

var r = require('rethinkdbdash')(config);

module.exports = { db: r };
