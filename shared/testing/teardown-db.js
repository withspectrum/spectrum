import data from './data';
const tables = Object.keys(data);

const db = require('rethinkdbdash')({
  db: 'testing',
});

/**
 * This is run after all tests in src/setupTests.js
 */
export const teardown = () => {
  return Promise.all(tables.map(table => db.tableDrop(table).run()))
    .then(() => db.getPool().drain())
    .then(() => {
      // Tests would stall on CI because for some reason Rethinkdbdash doesn't exit
      // even after draining the connection pool, so we force it to exit.
      if (process.env.CI) {
        setTimeout(() => process.exit(), 1);
      }
    })
    .catch(err => {
      console.log(err);
      throw err;
    });
};

db.dbDrop('testing').run().then(teardown).then(() => process.exit());
