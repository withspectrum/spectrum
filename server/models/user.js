const { db } = require('./db');

const getUser = id => {
  const { connection } = require('./db');
  return db.table('users').get(id).run(connection);
};

const getUserByProviderId = providerId => {
  const { connection } = require('./db');
  return db.table('users').filter({ providerId }).run(connection).then(
    cursor =>
      new Promise(resolve => {
        cursor.toArray((err, result) => {
          if (err) throw err;
          resolve(result ? result[0] : null);
        });
      })
  );
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
  createOrFindUser,
  storeUser,
};
