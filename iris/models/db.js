// @flow
/**
 * Database setup is done here
 */
const IS_PROD = !process.env.FORCE_DEV && process.env.NODE_ENV === 'production';

const DEFAULT_CONFIG = {
  // Connect to the test database when, well, testing
  db: !process.env.TEST_DB ? 'spectrum' : 'testing',
  timeoutGb: 10 * 1000, // How long should an unused connection stick around, default is an hour, this is 10s
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

if (process.env.NODE_ENV === 'development') {
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
