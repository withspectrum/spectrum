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
    migrationsDirectory: path.resolve(__dirname, '../../iris/migrations'),
    db: 'testing',
    op: 'up',
  });

  debug(`migrations complete, inserting data into "testing"`);
  await Promise.all(
    tables.map(table => {
      debug(`inserting test data into ${table}`);
      // Soft durability for all tables by default because that's faster, we don't
      // actually care about writing stuff to disk while testing
      return (
        mockDb
          .table(table)
          .config()
          .update({ durability: 'soft' })
          .run()
          // Then insert the data
          .then(() =>
            mockDb
              .table(table)
              .insert(data[table], { conflict: 'replace' })
              .run()
          )
      );
    })
  );

  debug(`setup complete`);
};
