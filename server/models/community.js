/**
 * Storing and retrieving communities
 */
const { db } = require('./db');
const { cursorToArray } = require('./utils');

const getCommunity = id => {
  const { connection } = require('./db');
  return db.table('communities').get(id).run(connection);
};

const getCommunitiesByUser = uid => {
  const { connection } = require('./db');
  return db
    .table('communities')
    .filter(community => community('members').contains(uid))
    .run(connection)
    .then(cursorToArray);
};

module.exports = {
  getCommunity,
  getCommunitiesByUser,
};
