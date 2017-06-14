/**
 * Database setup is done here
 */
const fs = require('fs');
const path = require('path');
const IS_PROD = !process.env.FORCE_DEV && process.env.NODE_ENV === 'production';

const DEFAULT_CONFIG = {
  db: 'spectrum',
};

const PRODUCTION_CONFIG = {
  password: process.env.COMPOSE_RETHINKDB_PASSWORD,
  host: process.env.COMPOSE_RETHINKDB_URL,
  port: process.env.COMPOSE_RETHINKDB_PORT,
  ssl: {
    ca: fs.readFileSync(path.resolve(__dirname, '../cacert')),
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
