// @flow
const { db } = require('./db');
// $FlowFixMe
import UserError from '../utils/UserError';
import { uploadImage } from '../utils/s3';
import { createNewUsersSettings } from './usersSettings';
import { addQueue } from '../utils/workerQueue';

const getUser = (input: Object): Promise<Object> => {
  if (input.id) return getUserById(input.id);
  if (input.username) return getUserByUsername(input.username);

  throw new UserError(
    'Please provide either id or username to your user() query.'
  );
};

const getUserById = (userId: string): Promise<Object> => {
  return db
    .table('users')
    .get(userId)
    .run();
};

const getUserByEmail = (email: string): Promise<Object> => {
  return db
    .table('users')
    .getAll(email, { index: 'email' })
    .run()
    .then(results => (results.length > 0 ? results[0] : null));
};

const getUserByUsername = (username: string): Promise<Object> => {
  return db
    .table('users')
    .getAll(username, { index: 'username' })
    .run()
    .then(
      result =>
        result
          ? result[0]
          : new UserError(`No user found with the username ${username}`)
    );
};

const getUsers = (userIds: Array<string>): Promise<Array<Object>> => {
  return db
    .table('users')
    .getAll(...userIds)
    .run();
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
    .then(result => {
      if (result && result.length > 0) return result[0];
      throw new new UserError('No user found with this providerId')();
    });
};

const storeUser = (user: Object): Promise<Object> => {
  return db
    .table('users')
    .insert(user, { returnChanges: true })
    .run()
    .then(result => {
      const user = result.changes[0].new_val;

      // whenever a new user is created, create a usersSettings record
      // and send a welcome email
      addQueue('send new user welcome email', { user });
      return Promise.all([user, createNewUsersSettings(user.id)]);
    })
    .then(([user, settings]) => user);
};

const saveUserProvider = (userId, providerMethod, providerId) => {
  return db
    .table('users')
    .get(userId)
    .run()
    .then(result => {
      let obj = Object.assign({}, result);
      obj[providerMethod] = providerId;
      return obj;
    })
    .then(user => {
      return db
        .table('users')
        .get(userId)
        .update(
          {
            ...user,
          },
          { returnChanges: true }
        )
        .run()
        .then(result => result.changes[0].new_val);
    });
};

const getUserByIndex = (indexName, indexValue) => {
  return db
    .table('users')
    .getAll(indexValue, { index: indexName })
    .run()
    .then(results => results && results.length > 0 && results[0]);
};

const createOrFindUser = (
  user: Object,
  providerMethod: string
): Promise<Object> => {
  // if a user id gets passed in, we know that a user most likely exists and we just need to retrieve them from the db
  // however, if a user id doesn't exist we need to do a lookup by the email address passed in - if an email address doesn't exist, we know that we're going to be creating a new user
  let promise;
  if (user.id) {
    promise = getUser({ id: user.id });
  } else {
    if (user[providerMethod]) {
      promise = getUserByIndex(
        providerMethod,
        user[providerMethod]
      ).then(storedUser => {
        if (storedUser) {
          return storedUser;
        }

        if (user.email) {
          return getUserByEmail(user.email);
        } else {
          return Promise.resolve({});
        }
      });
    } else {
      if (user.email) {
        promise = getUserByEmail(user.email);
      } else {
        promise = Promise.resolve({});
      }
    }
  }

  return promise
    .then(storedUser => {
      // if a user is found with an id or email, return the user in the db
      if (storedUser && storedUser.id) {
        // if a user is signing in with a second auth method from what their user was created with, store the new auth method
        if (!storedUser[providerMethod]) {
          return saveUserProvider(
            storedUser.id,
            providerMethod,
            user[providerMethod]
          ).then(user => Promise.resolve(storedUser));
        } else {
          return Promise.resolve(storedUser);
        }
      }

      // if no user exists, create a new one with the oauth profile data
      return storeUser(user);
    })
    .catch(err => {
      if (user.id) {
        throw new UserError(`No user found for id ${user.id}.`);
      }
      return storeUser(user);
    });
};

const setUsername = (id: string, username: string) => {
  return db
    .table('users')
    .get(id)
    .update(
      {
        username,
      },
      { returnChanges: true }
    )
    .run()
    .then(result => result.changes[0].new_val);
};

const getEverything = (
  userId: string,
  { first, after }
): Promise<Array<any>> => {
  return db
    .table('usersChannels')
    .getAll(userId, { index: 'userId' })
    .filter(userChannel => userChannel('isMember').eq(true))
    .map(userChannel => userChannel('channelId'))
    .run()
    .then(
      userChannels =>
        userChannels &&
        userChannels.length > 0 &&
        db
          .table('threads')
          .orderBy({ index: db.desc('lastActive') })
          .filter(thread =>
            db
              .expr(userChannels)
              .contains(thread('channelId'))
              .and(db.not(thread.hasFields('deletedAt')))
          )
          .skip(after || 0)
          .limit(first)
          .run()
    );
};

const getUsersThreadCount = (
  threadIds: Array<string>
): Promise<Array<Object>> => {
  const getThreadCounts = threadIds.map(creatorId =>
    db
      .table('threads')
      .getAll(creatorId, { index: 'creatorId' })
      .count()
      .run()
  );

  return Promise.all(getThreadCounts).then(result => {
    return result.map((threadCount, index) => ({
      id: threadIds[index],
      count: threadCount,
    }));
  });
};

export type EditUserArguments = {
  input: {
    file: any,
    name: string,
    description: string,
    website: string,
  },
};

const editUser = (
  input: EditUserArguments,
  userId: string
): Promise<Object> => {
  const {
    input: { name, description, website, file, coverFile, username, timezone },
  } = input;
  return db
    .table('users')
    .get(userId)
    .run()
    .then(result => {
      return Object.assign({}, result, {
        name,
        description,
        website,
        username,
        timezone,
      });
    })
    .then(user => {
      // if no file was uploaded, update the community with new string values

      if (file || coverFile) {
        if (file && !coverFile) {
          return uploadImage(file, 'users', user.id).then(profilePhoto => {
            // update the user with the profilePhoto
            return (
              db
                .table('users')
                .get(user.id)
                .update(
                  {
                    ...user,
                    profilePhoto,
                  },
                  { returnChanges: 'always' }
                )
                .run()
                // return the resulting user with the profilePhoto set
                .then(result => {
                  // if an update happened
                  if (result.replaced === 1) {
                    return result.changes[0].new_val;
                  }

                  // an update was triggered from the client, but no data was changed
                  if (result.unchanged === 1) {
                    return result.changes[0].old_val;
                  }
                })
            );
          });
        } else if (!file && coverFile) {
          return uploadImage(coverFile, 'users', user.id).then(coverPhoto => {
            // update the user with the profilePhoto
            return (
              db
                .table('users')
                .get(user.id)
                .update(
                  {
                    ...user,
                    coverPhoto,
                  },
                  { returnChanges: 'always' }
                )
                .run()
                // return the resulting user with the profilePhoto set
                .then(result => {
                  // if an update happened
                  if (result.replaced === 1) {
                    return result.changes[0].new_val;
                  }

                  // an update was triggered from the client, but no data was changed
                  if (result.unchanged === 1) {
                    return result.changes[0].old_val;
                  }
                })
            );
          });
        } else if (file && coverFile) {
          const uploadFile = file => {
            return uploadImage(file, 'users', user.id);
          };

          const uploadCoverFile = coverFile => {
            return uploadImage(coverFile, 'users', user.id);
          };

          return Promise.all([
            uploadFile(file),
            uploadCoverFile(coverFile),
          ]).then(([profilePhoto, coverPhoto]) => {
            return (
              db
                .table('users')
                .get(user.id)
                .update(
                  {
                    ...user,
                    coverPhoto,
                    profilePhoto,
                  },
                  { returnChanges: 'always' }
                )
                .run()
                // return the resulting community with the profilePhoto set
                .then(result => {
                  // if an update happened
                  if (result.replaced === 1) {
                    return result.changes[0].new_val;
                  }

                  // an update was triggered from the client, but no data was changed
                  if (result.unchanged === 1) {
                    return result.changes[0].old_val;
                  }
                })
            );
          });
        }
      } else {
        return db
          .table('users')
          .get(user.id)
          .update(
            {
              ...user,
            },
            { returnChanges: 'always' }
          )
          .run()
          .then(result => {
            // if an update happened
            if (result.replaced === 1) {
              return result.changes[0].new_val;
            }

            // an update was triggered from the client, but no data was changed
            if (result.unchanged === 1) {
              return result.changes[0].old_val;
            }
          });
      }
    });
};

const setUserOnline = (id: string, isOnline: boolean) => {
  let data = {
    isOnline,
  };

  // If a user is going offline, store their lastSeen
  if (isOnline === false) {
    data.lastSeen = new Date();
  }
  return db
    .table('users')
    .get(id)
    .update(data, { returnChanges: true })
    .run()
    .then(result => result.changes[0].new_val);
};

const updateUserEmail = (userId: string, email: string): Promise<Object> => {
  return db
    .table('users')
    .get(userId)
    .update({
      email,
    })
    .run()
    .then(() => getUserById(userId));
};

module.exports = {
  getUser,
  getUserById,
  getUserByEmail,
  getUsersThreadCount,
  getUsers,
  getUsersBySearchString,
  createOrFindUser,
  storeUser,
  editUser,
  getEverything,
  setUserOnline,
  updateUserEmail,
};
