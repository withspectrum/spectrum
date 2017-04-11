/**
 * Storing and retrieving frequencies
 */
const { db } = require('./db');
const { cursorToArray } = require('./utils');

const getFrequenciesByCommunity = community => {
  const { connection } = require('./db');
  return db
    .table('frequencies')
    .filter({ community })
    .run(connection)
    .then(cursorToArray);
};

const getFrequenciesByUser = uid => {
  const { connection } = require('./db');
  return db
    .table('frequencies')
    .filter(frequency => frequency('subscribers').contains(uid))
    .run(connection)
    .then(cursorToArray);
};

const getFrequency = id => {
  const { connection } = require('./db');
  return db.table('frequencies').get(id).run(connection);
};

module.exports = {
  getFrequency,
  getFrequenciesByUser,
  getFrequenciesByCommunity,
};
