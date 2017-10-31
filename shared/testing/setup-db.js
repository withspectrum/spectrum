import data from './data';
const tables = Object.keys(data);

/**
 * This is run before all tests
 */
export const setup = db => {
  // Create the tables
  return Promise.all(
    tables.map(table =>
      db
        .table(table)
        .insert(data[table])
        .run()
    )
  ).catch(err => {
    console.log(err);
    throw err;
  });
};

const db = require('rethinkdbdash')({
  db: 'testing',
});

setup(db).then(() => process.exit());
