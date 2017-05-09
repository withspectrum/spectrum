// @flow
const { db } = require('./db');
import { UserError } from 'graphql-errors';
import photoToS3 from '../utils/s3';

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

const getUserByUid = (uid: String) => {
  return db.table('users').get(uid).run();
};

const getUserByUsername = (username: string) => {
  return db
    .table('users')
    .filter({ username })
    .run()
    .then(result => result && result[0]);
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

const uploadPhoto = (file: Object, user: Object) => {
  // upload logic here with `file`
  return photoToS3(file, user, data => {
    let path = data.path;
    // remove the bucket name from the url
    path = path.replace('/spectrum-chat', '');

    // this is the default source for our imgix account, which starts
    // at the bucket root, thus we remove the bucket from the path
    let imgixBase = 'https://spectrum.imgix.net';

    // return a new url to update the user object
    let photoURL = imgixBase + path;

    // update the user object and return the updated user
    return db
      .table('users')
      .get(user.uid)
      .update(
        {
          photoURL,
        },
        { returnChanges: true }
      )
      .run()
      .then(
        result =>
          (result.changes.length > 0
            ? result.changes[0].new_val
            : db.table('users').get(user.uid).run())
      );
  });
};

module.exports = {
  getUser,
  getUserByUid,
  getUserMetaData,
  getUsers,
  createOrFindUser,
  storeUser,
  getAllStories,
  uploadPhoto,
};
