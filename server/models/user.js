// @flow
const { db } = require('./db');

const getUser = (id: String) => {
  return db.table('users').get(id).run();
};

const getUsers = (uids: Array<String>) => {
  return db.table('users').getAll(...uids).run();
};

const getUserByProviderId = providerId => {
  return db
    .table('users')
    .filter({ providerId })
    .run()
    .then(result => result && result.length > 0 && result[0]);
};

const storeUser = user => {
  return db
    .table('users')
    .insert(user, { returnChanges: true })
    .run()
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

const getAllStories = (frequencies: Array<String>) => {
  return db
    .table('stories')
    .orderBy(db.desc('modifiedAt'))
    .filter(story => db.expr(frequencies).contains(story('frequency')))
    .run();
};

const getUserMetaData = (id: String) => {
  const getStoryCount = db
    .table('stories')
    .filter({ author: id })
    .count()
    .run();

  return Promise.all([getStoryCount]);
};

module.exports = {
  getUser,
  getUserMetaData,
  getUsers,
  createOrFindUser,
  storeUser,
  getAllStories,
};
