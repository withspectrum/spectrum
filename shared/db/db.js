// @flow
/**
 * Database setup is done here
 */
const IS_PROD = !process.env.FORCE_DEV && process.env.NODE_ENV === 'production';

const DEFAULT_CONFIG = {
  // Connect to the test database when, well, testing
  db: !process.env.TEST_DB ? 'spectrum' : 'testing',
  max: 60, // Maximum number of connections, default is 1000
  buffer: 1, // Minimum number of connections open at any given moment, default is 50
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

// Exit the process on unhealthy db in test env
if (process.env.TEST_DB) {
  r.getPoolMaster().on('healthy', healthy => {
    if (!healthy) {
      process.exit(1);
    }
  });
}

const fs = require('fs');
const inspect = require('rethinkdb-inspector');
const queries = [];
let slowestQuery = { query: '', time: 0 };
let biggestQuery = { query: '', size: 0 };
inspect(r, {
  onQueryComplete: (query, { size, time }) => {
    if (query.indexOf('.changes') > -1) return;
    queries.push({ query, time, size });
    const newSlowestQuery = queries.sort((a, b) => b.time - a.time)[0];
    const newBiggestQuery = queries.sort((a, b) => b.size - a.size)[0];
    if (newSlowestQuery.time > slowestQuery.time) {
      slowestQuery = newSlowestQuery;
      console.log(
        `\n---New Slowest Query (${newSlowestQuery.time}ms)---\n`,
        newSlowestQuery.query,
        '\n------\n\n'
      );
    }
    if (newBiggestQuery.size > biggestQuery.size) {
      biggestQuery = newBiggestQuery;
      console.log(
        `\n---New biggest query (${newBiggestQuery.size} bytes response)---\n`,
        newBiggestQuery.query,
        '\n------\n\n'
      );
    }
  },
});

module.exports = { db: r };
