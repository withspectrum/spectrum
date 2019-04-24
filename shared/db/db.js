// @flow
/**
 * Database setup is done here
 */
import fs from 'fs';
import path from 'path';
import inspect from 'rethinkdb-inspector';
import { statsd } from '../statsd';

const IS_PROD = !process.env.FORCE_DEV && process.env.NODE_ENV === 'production';

const CONNECTIONS = 20;
const DEFAULT_CONFIG = {
  // Connect to the test database when, well, testing
  db: !process.env.TEST_DB ? 'spectrum' : 'testing',
  max: CONNECTIONS, // Maximum number of connections, default is 1000
  buffer: CONNECTIONS, // Minimum number of connections open at any given moment, default is 50
  timeoutGb: 60 * 60 * 1000, // How long should an unused connection stick around, default is an hour, this is a minute
  timeout: 30, // The number of seconds for a connection to be opened, default 20
};

let ca;

try {
  ca = fs.readFileSync(path.join(process.cwd(), 'cacert'));
} catch (err) {}

if (!ca && IS_PROD)
  throw new Error(
    'Please provide the SSL certificate to connect to the production database in a file called `cacert` in the root directory.'
  );

const PRODUCTION_CONFIG = {
  servers: [
    {
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
    },
    {
      password: process.env.COMPOSE_RETHINKDB_PASSWORD,
      host: process.env.BACKUP_RETHINKDB_URL,
      port: process.env.BACKUP_RETHINKDB_PORT,
      ...(ca
        ? {
            ssl: {
              ca,
            },
          }
        : {}),
    },
  ],
};

const config = IS_PROD
  ? {
      ...DEFAULT_CONFIG,
      ...PRODUCTION_CONFIG,
    }
  : {
      ...DEFAULT_CONFIG,
    };

let r = require('rethinkhaberdashery')(config);
const poolMaster = r.getPoolMaster();

poolMaster.on('queueing', size => {
  statsd.gauge('db.query_queue.size', size);
});

setInterval(() => {
  statsd.gauge('db.connections.count', poolMaster.getLength());
}, 5000);

// Exit the process on unhealthy db in test env
if (process.env.TEST_DB) {
  poolMaster.on('healthy', healthy => {
    if (!healthy) {
      process.exit(1);
    }
  });
}

const queries = [];
inspect(r, {
  onQueryComplete: (query, { size, time }) => {
    if (query.indexOf('.changes') > -1) return;
    statsd.increment('db.queries.count');
    statsd.histogram('db.queries.response_time', time);
    statsd.histogram('db.queries.response_size', size);
    // In development write out a file of the most expensive queries
    if (process.env.NODE_ENV === 'development' && process.env.TRACK_DB_PERF) {
      queries.push({ query, time, size });
      fs.writeFileSync(
        'queries-by-time.js',
        JSON.stringify(queries.sort((a, b) => b.time - a.time), null, 2)
      );
      fs.writeFileSync(
        'queries-by-response-size.js',
        JSON.stringify(queries.sort((a, b) => b.size - a.size), null, 2)
      );
    }
  },
});

module.exports = { db: r };
