/**
 * Storing and retrieving frequencies
 */
const { db } = require('./db');

const getFrequenciesByCommunity = community => {
  return db.table('frequencies').filter({ community }).run();
};

const getFrequenciesByUser = (uid: String) => {
  return db
    .table('frequencies')
    .filter(frequency => frequency('subscribers').contains(uid))
    .run();
};

const getFrequency = id => {
  return db.table('frequencies').get(id).run();
};

const getFrequencyMetaData = (id: String) => {
  const getStoryCount = db
    .table('stories')
    .filter({ frequency: id })
    .count()
    .run();
  const getSubscriberCount = db
    .table('frequencies')
    .get(id)
    .getField('subscribers')
    .count()
    .run();

  return Promise.all([getStoryCount, getSubscriberCount]);
};

module.exports = {
  getFrequency,
  getFrequencyMetaData,
  getFrequenciesByUser,
  getFrequenciesByCommunity,
};
