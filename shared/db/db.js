// @flow
/**
 * Database setup is done here
 */
import fs from 'fs';
import path from 'path';

const IS_PROD = !process.env.FORCE_DEV && process.env.NODE_ENV === 'production';

const DEFAULT_CONFIG = {
  // Connect to the test database when, well, testing
  db: !process.env.TEST_DB ? 'spectrum' : 'testing',
  max:
    process.env.SENTRY_NAME === 'api' || process.env.SENTRY_NAME === 'hyperion'
      ? 60
      : 1, // Maximum number of connections, default is 1000
  buffer: 1, // Minimum number of connections open at any given moment, default is 50
  timeoutGb: 60 * 1000, // How long should an unused connection stick around, default is an hour, this is a minute
};

let ca;

try {
  ca = fs.readFileSync(path.join(process.cwd(), 'cacert'));
} catch (err) {
  if (IS_PROD) throw err;
}

const PRODUCTION_CONFIG = {
  password: process.env.COMPOSE_RETHINKDB_PASSWORD,
  host: process.env.COMPOSE_RETHINKDB_URL,
  port: process.env.COMPOSE_RETHINKDB_PORT,
  ...(ca
    ? {
        ssl: {
          ca,
        },
      }
    : {}),
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

// Exit the process on unhealthy db in test env
if (process.env.TEST_DB) {
  r.getPoolMaster().on('healthy', healthy => {
    if (!healthy) {
      process.exit(1);
    }
  });
}

if (process.env.NODE_ENV === 'development' && process.env.TRACK_DB_PERF) {
  const fs = require('fs');
  const inspect = require('rethinkdb-inspector');
  const queries = [];
  inspect(r, {
    onQueryComplete: (query, { size, time }) => {
      if (query.indexOf('.changes') > -1) return;
      queries.push({ query, time, size });
      fs.writeFileSync(
        'queries-by-time.js',
        JSON.stringify(queries.sort((a, b) => b.time - a.time), null, 2)
      );
      fs.writeFileSync(
        'queries-by-response-size.js',
        JSON.stringify(queries.sort((a, b) => b.size - a.size), null, 2)
      );
    },
  });
}

module.exports = { db: r };
