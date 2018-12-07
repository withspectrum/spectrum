// @flow
/**
 * Database setup is done here
 */
import fs from 'fs';
import path from 'path';
import { createPool } from 'generic-pool';

const IS_PROD = !process.env.FORCE_DEV && process.env.NODE_ENV === 'production';

const r = require('rethinkhaberdashery')({ pool: false, optionalRun: false });

let ca;

try {
  ca = fs.readFileSync(path.join(process.cwd(), 'cacert'));
} catch (err) {}

if (!ca && IS_PROD)
  throw new Error(
    'Please provide the SSL certificate to connect to the production database in a file called `cacert` in the root directory.'
  );

const DEFAULT_CONNECTION_CONFIG = {
  // Connect to the test database when, well, testing
  db: !process.env.TEST_DB ? 'spectrum' : 'testing',
};

const PRODUCTION_CONNECTION_CONFIG = {
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

const CONNECTION_CONFIG = IS_PROD
  ? {
      ...DEFAULT_CONNECTION_CONFIG,
      ...PRODUCTION_CONNECTION_CONFIG,
    }
  : {
      ...DEFAULT_CONNECTION_CONFIG,
    };

const changefeedConn = r.connect(CONNECTION_CONFIG);

const pool = createPool(
  {
    create: () =>
      r.connect(CONNECTION_CONFIG).then(conn => {
        conn.on('error', err => {
          throw err;
        });
        return conn;
      }),
    destroy: conn => conn.close(),
  },
  {
    min: 1,
    max: 5,
  }
);

// Taken from neumino/rethinkdbdash
const CHANGES_PROTODEF = 152;
// Queries are structured as trees and stored as arrays
// this iterates over the whole tree and checks whether any part contains .changes(),
// which has the proto defition of 152
const isChangefeedQuery = query => {
  if (!query) return false;
  if (!Array.isArray(query)) return query === 152;
  return (
    query[0] === 152 ||
    query[1] === 152 ||
    isChangefeedQuery(query[0]) ||
    isChangefeedQuery(query[1])
  );
};

// Monkey-patch query.run() to automatically pass in the single connection we use
const run = r._Term.prototype.run;
r._Term.prototype.run = function monkeyPatchedRun(...args) {
  const self = this;
  // Don't run changefeed queries on connections from the pool as those might be cancelled eventually
  if (isChangefeedQuery(self._query)) {
    return Promise.resolve(changefeedConn).then(conn => {
      return run.call(self, conn, ...args);
    });
  }
  return pool.acquire().then(conn => {
    return run.call(self, conn, ...args).then(result => {
      pool.release(conn);
      return result;
    });
  });
};

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
