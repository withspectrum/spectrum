const debug = require('debug')('testing:teardown');
const mockDb = require('./db');

module.exports = async () => {
  debug(`drop database "testing"`);
  await mockDb.dbDrop('testing');
  debug(`database "testing" dropped, finishing`);
};
