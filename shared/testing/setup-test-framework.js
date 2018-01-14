// Set up the test environment
const path = require('path');
const debug = require('debug')('testing:setup-test-framework');
const { migrate } = require('rethinkdb-migrate/lib');
const uuid = require('uuid/v4');

debug('logging with debug enabled');

// Create a separate db for each test suite
const dbName = uuid().replace(/-/g, '_'); // Hyphens aren't valid as db names in RethinkDB
debug(`creating database ${dbName}`);
const mockDb = require('rethinkdbdash')({
  db: dbName,
});

// Wait for 15s before timing out, this is useful for e2e tests which have a tendency to time out
jest.setTimeout(15000);

const { setup } = require('./setup-db');

// For each test suite set up a separate db, migrate it and add the test data
beforeAll(() => {
  debug(`migrate database ${dbName} before all tests`);
  return migrate({
    driver: 'rethinkdbdash',
    host: 'localhost',
    port: 28015,
    migrationsDirectory: path.resolve(__dirname, '../../iris/migrations'),
    db: dbName,
    op: 'up',
  })
    .then(() => {
      debug(`migrations complete, inserting data into ${dbName}`);
      return setup(mockDb);
    })
    .then(() => {
      debug('data insertion complete, running tests');
    });
});

// After each test suite drop that test suites' test database
afterAll(() => {
  debug(`drop database ${dbName}`);
  return mockDb.dbDrop(dbName).then(() => {
    debug(`database ${dbName} dropped`);
  });
});

// Mock the database
debug('mocking the database used in iris');
jest.mock('iris/models/db', () => ({
  db: mockDb,
}));
