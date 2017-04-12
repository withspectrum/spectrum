/**
 * Storing and retrieving frequencies
 */
const { db } = require('./db');

const getFrequenciesByCommunity = community => {
  return db.table('frequencies').filter({ community }).run();
};

const getFrequenciesByUser = uid => {
  return db
    .table('frequencies')
    .filter(frequency => frequency('subscribers').contains(uid))
    .run();
};

const getFrequency = id => {
  return db.table('frequencies').get(id).run();
};

module.exports = {
  getFrequency,
  getFrequenciesByUser,
  getFrequenciesByCommunity,
};
