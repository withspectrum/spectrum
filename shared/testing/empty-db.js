import data from './data';
import db from './db';
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

empty(db).then(() => process.exit());
