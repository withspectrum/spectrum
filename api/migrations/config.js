const path = require('path');
const fs = require('fs');
const debug = require('debug')('migrations');

const DEFAULT_CONFIG = {
  driver: 'rethinkdbdash',
  db: process.env.NODE_ENV === 'test' ? 'testing' : 'spectrum',
  host: 'localhost',
  port: 28015,
  migrationsDirectory: 'api/migrations',
};

let ca;

try {
  ca = fs.readFileSync(path.join(process.cwd(), 'cacert'));
} catch (err) {}

const RUN_IN_PROD = !!process.env.AWS_RETHINKDB_PASSWORD;

if (!ca && RUN_IN_PROD)
  throw new Error(
    'Please provide the SSL certificate to connect to the production database in a file called `cacert` in the root directory.'
  );

if (RUN_IN_PROD && process.argv[4] === 'down') {
  throw new Error('Do not drop the production database!!!!!');
}

if (RUN_IN_PROD) debug('Running migration in production...');

module.exports = !RUN_IN_PROD
  ? DEFAULT_CONFIG
  : Object.assign({}, DEFAULT_CONFIG, {
      password: process.env.AWS_RETHINKDB_PASSWORD,
      host: process.env.AWS_RETHINKDB_URL,
      port: process.env.AWS_RETHINKDB_PORT,
      ...(ca
        ? {
            ssl: {
              ca,
            },
          }
        : {}),
    });
