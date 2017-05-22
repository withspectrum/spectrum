// @flow
const { db } = require('./db');
import { UserError } from 'graphql-errors';
import photoToS3 from '../utils/s3';

const getUser = (input: Object): Promise<Object> => {
  if (input.id) return getUserById(input.id);
  if (input.username) return getUserByUsername(input.username);

  throw new UserError(
    'Please provide either id or username to your user() query.'
  );
};

const getUserById = (userId: string): Promise<Object> => {
  return db.table('users').get(userId).run();
};

const getUserByUsername = (username: string): Promise<Object> => {
  return db
    .table('users')
    .getAll(username, { index: 'username' })
    .run()
    .then(
      result =>
        (result
          ? result[0]
          : new UserError(`No user found with the username ${username}`))
    );
};

const getUsers = (userIds: Array<string>): Promise<Array<Object>> => {
  return db.table('users').getAll(...userIds).run();
};

const getUsersBySearchString = (string: string): Promise<Array<Object>> => {
  return (
    db
      .table('users')
      // get users whose username or displayname matches a case insensitive string
      .filter(user => user.coerceTo('string').match(`(?i)${string}`))
      // only return the 10 users who match to avoid overloading the dom and sending
      // down too much data at once
      .limit(10)
      .run()
  );
};

// leaving the filter here as an index on providerId would be a waste of
// space. This function is only invoked for signups when checking
// for an existing user on the previous Firebase stack.
const getUserByProviderId = (providerId: string): Promise<Object> => {
  return db
    .table('users')
    .filter({ providerId })
    .run()
    .then(
      result =>
        (result && result.length > 0
          ? result[0]
          : new UserError('No user found with this providerId'))
    );
};

const storeUser = (user: Object): Promise<Object> => {
  return db
    .table('users')
    .insert(user, { returnChanges: true })
    .run()
    .then(result => result.changes[0].new_val);
};

const createOrFindUser = (user: Object): Promise<Object> => {
  const promise = user.id
    ? getUser({ id: user.id })
    : getUserByProviderId(user.providerId);
  return promise.then(storedUser => {
    if (storedUser) return Promise.resolve(storedUser);

    return storeUser(user);
  });
};

const getEverything = (userId: string): Promise<Array<any>> => {
  console.log('user', userId);
  return (
    db
      .table('usersChannels')
      // get the user's channels
      .getAll(userId, { index: 'userId' })
      // get all the threads in the channels
      .eqJoin('channelId', db.table('threads'), { index: 'channelId' })
      // remove the channel permissions - this gets handled elsewhere
      .without({
        left: [
          'id',
          'channelId',
          'createdAt',
          'userId',
          'isMember',
          'isModerator',
          'isOwner',
        ],
      })
      // zip the data
      .zip()
      // remove threads where the user is blocked, pending, or the thread is deleted
      .filter({ isBlocked: false, isPending: false })
      .filter(thread => db.not(thread.hasFields('isDeleted')))
      // remove the fields for isblocked and ispending from the return object
      .without('isBlocked', 'isPending')
      .run()
  );
};

const getUsersThreadCount = (
  threadIds: Array<string>
): Promise<Array<Object>> => {
  const getThreadCounts = threadIds.map(creatorId =>
    db.table('threads').getAll(creatorId, { index: 'creatorId' }).count().run()
  );

  return Promise.all(getThreadCounts).then(result => {
    return result.map((threadCount, index) => ({
      id: threadIds[index],
      count: threadCount,
    }));
  });
};

const uploadPhoto = (file: Object, currentUser: Object): Promise<Object> => {
  // upload logic here with `file`
  return photoToS3(file, currentUser, data => {
    let path = data.path;
    // remove the bucket name from the url
    path = path.replace('/spectrum-chat', '');

    // this is the default source for our imgix account, which starts
    // at the bucket root, thus we remove the bucket from the path
    let imgixBase = 'https://spectrum.imgix.net';

    // return a new url to update the currentUser object
    let profilePhoto = imgixBase + path;

    // update the currentUser object and return the updated currentUser
    return db
      .table('users')
      .get(currentUser.id)
      .update(
        {
          profilePhoto,
        },
        { returnChanges: true }
      )
      .run()
      .then(
        result =>
          (result.changes.length > 0
            ? result.changes[0].new_val
            : db.table('users').get(currentUser.id).run())
      );
  });
};

module.exports = {
  getUser,
  getUsersThreadCount,
  getUsers,
  getUsersBySearchString,
  createOrFindUser,
  storeUser,
  uploadPhoto,
  getEverything,
};
