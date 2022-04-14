// This script gets run once after all tests
// It's responsible for clearing the test database
// NOTE(@mxstbr): While this teardown script could also do mockDb.dbDrop('testing'), that would mean that our API server would crash everytime due to changefeeds dropping, which would be very annoying. Instead we just clear the data from all the tables.
const debug = require('debug')('testing:teardown');
const mockDb = require('./db');
const data = require('./data');

const tables = Object.keys(data);

module.exports = () => {
  debug(`clearing data in database "testing"`);
  return Promise.all(
    tables.map(table =>
      mockDb
        .table(table)
        .delete()
        .run()
    )
  );
};
