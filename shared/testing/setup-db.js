import data from './data';
const debug = require('debug')('testing:setup-db');
const tables = Object.keys(data);

/**
 * This is run before all tests
 */
export const setup = db => {
  debug('inserting test data into db');
  // Create the tables
  return Promise.all(
    tables.map(table => {
      debug(`inserting test data into ${table}`);
      // Soft durability for all tables by default because that's faster, we don't
      // actually care about writing stuff to disk while testing
      return (
        db
          .table(table)
          .config()
          .update({ durability: 'soft' })
          .run()
          // Then insert the data
          .then(() =>
            db
              .table(table)
              .insert(data[table])
              .run()
          )
      );
    })
  ).catch(err => {
    console.log(err);
    throw err;
  });
};
