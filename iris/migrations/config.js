const path = require('path');
const fs = require('fs');

const DEFAULT_CONFIG = {
  driver: 'rethinkdbdash',
  db: 'spectrum',
  host: 'localhost',
  port: 28015,
  migrationsDirectory: 'iris/migrations',
};

const RUN_IN_PROD = !!process.env.COMPOSE_RETHINKDB_PASSWORD;

if (RUN_IN_PROD && process.argv[4] === 'down') {
  throw new Error('Do not drop the production database!!!!!');
  process.exit(1);
}

if (RUN_IN_PROD) console.log('Running migration in production...');

module.exports = !RUN_IN_PROD
  ? DEFAULT_CONFIG
  : Object.assign({}, DEFAULT_CONFIG, {
      password: process.env.COMPOSE_RETHINKDB_PASSWORD,
      host: process.env.COMPOSE_RETHINKDB_URL,
      port: process.env.COMPOSE_RETHINKDB_PORT,
      ssl: {
        ca: fs.readFileSync(path.resolve(__dirname, '../../cacert')),
      },
    });
