// @flow
const { db } = require('./db');
import { UserError } from 'graphql-errors';
import photoToS3 from '../utils/s3';

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
    .getAll(username, { index: 'username' })
    .run()
    .then(result => result && result[0]);
};

const getUsers = (uids: Array<string>) => {
  return db.table('users').getAll(...uids).run();
};

const getUsersBySearchString = string => {
  return (
    db
      .table('users')
      // get users whose username or displayname matches a case insensitive string
      .filter(user => user.coerceTo('string').match(`(?i)${string}`))
      // only return the 20 users who match to avoid overloading the dom and sending
      // down too much data at once
      .limit(20)
      .run()
      .then(result => result)
  );
};

// leaving the filter here as an index on providerId would be a waste of
// space. This function is only invoked for signups when checking
// for an existing user on the previous Firebase stack.
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
      .filter(story => db.not(story.hasFields('deleted')))
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
  getUsersStoryCount,
  getUsers,
  getUsersBySearchString,
  createOrFindUser,
  storeUser,
  uploadPhoto,
  getEverything,
};
