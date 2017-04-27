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

const getCommunityMetaData = (id: String) => {
  const getFrequencyCount = db
    .table('frequencies')
    .filter({ community: id })
    .count()
    .run();
  const getMemberCount = db
    .table('communities')
    .get(id)
    .getField('members')
    .count()
    .run();

  return Promise.all([getFrequencyCount, getMemberCount]);
};

module.exports = {
  getCommunity,
  getCommunityMetaData,
  getCommunitiesByUser,
};
