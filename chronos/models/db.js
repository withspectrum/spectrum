/**
 * Database setup is done here
 */
const IS_PROD = !process.env.FORCE_DEV && process.env.NODE_ENV === 'production';

const DEFAULT_CONFIG = {
  db: 'spectrum',
  max: 100, // Maximum number of connections, default is 1000
  buffer: 10, // Minimum number of connections open at any given moment, default is 50
  timeoutGb: 60 * 1000, // How long should an unused connection stick around, default is an hour, this is a minute
};

const PRODUCTION_CONFIG = {
  password: process.env.AWS_RETHINKDB_PASSWORD,
  host: process.env.AWS_RETHINKDB_URL,
  port: process.env.AWS_RETHINKDB_PORT,
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
