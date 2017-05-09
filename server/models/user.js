// @flow
const { db } = require('./db');
import { UserError } from 'graphql-errors';

type UidInput = {
  uid: string,
};

type UsernameInput = {
  username: string,
};

export type GetUserArgs = UidInput | UsernameInput;

const getUser = (input: GetUserArgs) => {
  if (input.uid) return getUserByUid(input.uid);
  if (input.username) return getUserByUsername(input.username);

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

const getEverything = (uid: string): Promise<Array<any>> => {
  return (
    db
      .table('stories')
      .orderBy(db.desc('modifiedAt'))
      // Add the frequency object to each story
      .eqJoin('frequency', db.table('frequencies'))
      // Only take the subscribers of a frequency
      .pluck({ left: true, right: { subscribers: true } })
      .zip()
      // Filter by the user being a subscriber to the frequency of the story
      .filter(story => story('subscribers').contains(uid))
      // Don't send the subscribers back
      .without('subscribers')
      .run()
  );
};

const getUsersStoryCount = (ids: Array<string>) => {
  const getStoryCounts = ids.map(id =>
    db.table('stories').filter({ author: id }).count().run()
  );

  return Promise.all(getStoryCounts).then(result => {
    return result.map((storyCount, index) => ({
      uid: ids[index],
      count: storyCount,
    }));
  });
};

module.exports = {
  getUser,
  getUsersStoryCount,
  getUsers,
  createOrFindUser,
  storeUser,
  getEverything,
};
