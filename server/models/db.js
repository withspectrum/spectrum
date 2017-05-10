/**
 * Database setup is done here
 */
const fs = require('fs');
const path = require('path');
const IS_PROD = process.env.NODE_ENV === 'production';

const DEFAULT_CONFIG = {
  db: 'spectrum',
};

const PRODUCTION_CONFIG = {
  password: 'e13386fb4f6573d38ab67c9514d6589e',
  host: 'aws-us-east-1-portal.6.dblayer.com',
  port: 19241,
  ssl: {
    ca: fs.readFileSync(path.resolve(__dirname, '../../cacert')),
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
