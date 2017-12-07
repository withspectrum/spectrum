import data from './data';
const tables = Object.keys(data);

/**
 * This is run after all tests
 */
export const empty = db => {
  // Create the tables
  return Promise.all(
    tables.map(table =>
      db
        .table(table)
        .delete()
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

empty(db).then(() => process.exit());
