import data from './data';
const tables = Object.keys(data);

/**
 * This is run before all tests in src/setupTests.js
 */
export const setup = () => {
  // Create the tables
  return (
    Promise.all(tables.map(table => db.tableCreate(table).run()))
      // Insert data into the tables
      .then(() =>
        Promise.all(
          tables.map(table => db.table(table).insert(data[table]).run())
        )
      )
      .catch(err => {
        console.log(err);
        throw err;
      })
  );
};

const db = require('rethinkdbdash')({
  db: 'testing',
});

db
  .dbCreate('testing')
  .run()
  .then(() => console.log('db created'))
  .then(setup)
  .then(() => process.exit());
