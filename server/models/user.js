const { db } = require('./db');
const { cursorToArray } = require('./utils');

const getUser = id => {
  const { connection } = require('./db');
  return db.table('users').get(id).run(connection);
};

const getUsers = uids => {
  const { connection } = require('./db');
  return db.table('users').getAll(...uids).run(connection).then(cursorToArray);
};

const getUserByProviderId = providerId => {
  const { connection } = require('./db');
  return db
    .table('users')
    .filter({ providerId })
    .run(connection)
    .then(cursorToArray);
};

const storeUser = user => {
  const { connection } = require('./db');
  return db
    .table('users')
    .insert(user, { returnChanges: true })
    .run(connection)
    .then(result => result.changes[0].new_val);
};

const createOrFindUser = user => {
  const promise = user.uid
    ? getUser(user.uid)
    : getUserByProviderId(user.providerId);
  return promise.then(storedUser => {
    if (storedUser) return Promise.resolve(storedUser);

    return storeUser(user);
  });
};

module.exports = {
  getUser,
  getUsers,
  createOrFindUser,
  storeUser,
};
