/**
 * Storing and retrieving communities
 */
const { db } = require('./db');

const getCommunity = id => {
  const { connection } = require('./db');
  return db.table('communities').get(id).run(connection);
};

module.exports = {
  getCommunity,
};
