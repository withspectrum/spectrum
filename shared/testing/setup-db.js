import data from './data';
const tables = Object.keys(data);

console.log('\nAdding test data to db...');
/**
 * This is run before all tests
 */
export const setup = db => {
  // Create the tables
  return Promise.all(
    tables.map(
      table =>
        console.log(`Insert data into ${table}`) ||
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

setup(db).then(
  () => console.log('Finished adding test data to db.') || process.exit()
);
