// This script gets run once before all tests
// It's responsible for setting up the test db with the test data
const path = require('path');
const debug = require('debug')('testing:setup');
const { migrate } = require('rethinkdb-migrate/lib');

const mockDb = require('./db');
const data = require('./data');

const tables = Object.keys(data);

module.exports = async () => {
  debug(`run all migrations over database "testing"`);
  await migrate({
    driver: 'rethinkdbdash',
    host: 'localhost',
    port: 28015,
    migrationsDirectory: path.resolve(__dirname, '../../api/migrations'),
    db: 'testing',
    op: 'up',
  });

  debug(`migrations complete, inserting data into "testing"`);
  await Promise.all(
    tables.map(table =>
      mockDb
        .table(table)
        .insert(data[table], { conflict: 'replace' })
        .run()
    )
  );

  debug(`setup complete`);
};
