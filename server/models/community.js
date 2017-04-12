/**
 * Storing and retrieving communities
 */
const { db } = require('./db');

const getCommunity = id => {
  return db.table('communities').get(id).run();
};

const getCommunitiesByUser = uid => {
  return db
    .table('communities')
    .filter(community => community('members').contains(uid))
    .run();
};

module.exports = {
  getCommunity,
  getCommunitiesByUser,
};
