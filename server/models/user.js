// @flow
const { db } = require('./db');
import { UserError } from 'graphql-errors';

export type GetUserArgs = {
  uid?: string,
  username?: string,
};

const getUser = ({ uid, username }: GetUserArgs) => {
  if (uid) return getUserByUid(uid);
  if (username) return getUserByUsername(username);

  throw new UserError(
    'Please provide either id or username to your user() query.'
  );
};

const getUserByUid = (uid: string) => {
  return db.table('users').get(uid).run();
};

const getUserByUsername = (username: string) => {
  return db
    .table('users')
    .filter({ username })
    .run()
    .then(result => result && result[0]);
};

const getUsers = (uids: Array<string>) => {
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
    ? getUser({ uid: user.uid })
    : getUserByProviderId(user.providerId);
  return promise.then(storedUser => {
    if (storedUser) return Promise.resolve(storedUser);

    return storeUser(user);
  });
};

const getAllStories = (frequencies: Array<string>) => {
  return db
    .table('stories')
    .orderBy(db.desc('modifiedAt'))
    .filter(story => db.expr(frequencies).contains(story('frequency')))
    .run();
};

const getUserMetaData = (id: string) => {
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
