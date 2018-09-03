// @flow
const { db } = require('./db');
import { createQuery } from 'shared/rethinkdb/create-query';
import { uploadImage } from '../utils/file-storage';
import { createNewUsersSettings } from './usersSettings';
import { sendNewUserWelcomeEmailQueue } from 'shared/bull/queues';
import { events } from 'shared/analytics';
import { trackQueue, identifyQueue } from 'shared/bull/queues';
import { getUserChannelIds } from './usersChannels';
import type { PaginationOptions } from '../utils/paginate-arrays';
import type { DBUser, FileUpload, DBThread } from 'shared/types';

const getUserById = createQuery({
  read: (userId: string) => db.table('users').get(userId),
  tags: (userId: string) => (user: ?DBUser) => [userId],
});

const getUserByEmail = createQuery({
  read: (email: string) => db.table('users').getAll(email, { index: 'email' }),
  process: (users: ?Array<DBUser>) => (users && users[0]) || null,
  tags: (email: string) => (user: ?DBUser) => (user ? [user.id] : []),
});

const getUserByUsername = createQuery({
  read: (username: string) =>
    db.table('users').getAll(username, { index: 'username' }),
  process: (users: ?Array<DBUser>) => (users && users[0]) || null,
  tags: (username: string) => (user: ?DBUser) => (user ? [user.id] : []),
});

const getUsersByUsername = createQuery({
  read: (usernames: Array<string>) =>
    db.table('users').getAll(...usernames, { index: 'username' }),
  tags: () => (users: ?Array<DBUser>) =>
    users ? users.map(({ id }) => id) : [],
});

const getUsers = createQuery({
  read: (userIds: Array<string>) => db.table('users').getAll(...userIds),
  tags: () => (users: ?Array<DBUser>) =>
    users ? users.map(({ id }) => id) : [],
});

const storeUser = createQuery({
  write: (user: Object) =>
    db.table('users').insert(
      {
        ...user,
        modifiedAt: null,
      },
      { returnChanges: true }
    ),
  process: (result: ?{ changes: { new_val: DBUser } }) => {
    if (!result || !result.changes || !result.changes.new_val) return null;
    const user = result.changes[0].new_val;

    identifyQueue.add({ userId: user.id });
    trackQueue.add({ userId: user.id, event: events.USER_CREATED });
    sendNewUserWelcomeEmailQueue.add({ user });
    return Promise.all([user, createNewUsersSettings(user.id)]).then(
      ([user]) => user
    );
  },
  invalidateTags: () => (user: DBUser) => [user.id],
});

const saveUserProvider = createQuery({
  write: (
    userId: string,
    providerMethod: string,
    providerId: number,
    extraFields?: Object
  ) =>
    db
      .table('users')
      .get(userId)
      .update(
        {
          [providerMethod]: providerId,
          ...extraFields,
        },
        { returnChanges: true }
      ),
  process: (result: ?{ changes: [{ new_val: DBUser }] }) => {
    if (!result) return null;
    const user = result.changes[0].new_val;
    // TODO(@mxstbr): Fix this
    // trackQueue.add({
    //   userId: user.id,
    //   event: events.USER_ADDED_PROVIDER,
    //   properties: {
    //     providerMethod,
    //   },
    // });

    identifyQueue.add({ userId: user.id });

    return user;
  },
  invalidateTags: () => (user: ?DBUser) => (user ? [user.id] : []),
});

const getUserByIndex = createQuery({
  read: (indexName: string, indexValue: string) =>
    db.table('users').getAll(indexValue, { index: indexName }),
  process: (results: ?Array<DBUser>) => (results ? results[0] : null),
  tags: () => (user: ?DBUser) => (user ? [user.id] : []),
});

// prettier-ignore
const createOrFindUser = (user: Object, providerMethod: string): Promise<?DBUser> => {
  // if a user id gets passed in, we know that a user most likely exists and we just need to retrieve them from the db
  // however, if a user id doesn't exist we need to do a lookup by the email address passed in - if an email address doesn't exist, we know that we're going to be creating a new user
  let promise;
  if (user.id) {
    promise = getUserById(user.id);
  } else {
    if (user[providerMethod]) {
      promise = getUserByIndex(providerMethod, user[providerMethod]).then(
        storedUser => {
          if (storedUser) {
            return storedUser;
          }

          if (user.email) {
            return getUserByEmail(user.email);
          } else {
            return Promise.resolve(null);
          }
        }
      );
    } else {
      if (user.email) {
        promise = getUserByEmail(user.email);
      } else {
        promise = Promise.resolve(null);
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
          ).then(() => Promise.resolve(storedUser));
        } else {
          return Promise.resolve(storedUser);
        }
      }

      // if no user exists, create a new one with the oauth profile data
      return storeUser(user);
    })
    .catch(err => {
      if (user.id) {
        console.error(err);
        return null;
      }
      return storeUser(user);
    });
};

const getEverything = createQuery({
  read: (userId: string, options: PaginationOptions) =>
    getUserChannelIds(userId).then(userChannels => {
      if (!userChannels || userChannels.length === 0) return [];

      return db
        .table('threads')
        .orderBy({ index: db.desc('lastActive') })
        .filter(thread =>
          db
            .expr(userChannels)
            .contains(
              thread('channelId').and(db.not(thread.hasFields('deletedAt')))
            )
        )
        .skip(options.after || 0)
        .limit(options.first);
    }),
  tags: (userId: string) => (threads: ?Array<DBThread>) => [
    userId,
    ...(threads || []).map(({ id }) => id),
    ...(threads || []).map(({ channelId }) => channelId),
    ...(threads || []).map(({ communityId }) => communityId),
  ],
});

type UserThreadCount = {
  id: string,
  count: number,
};
// prettier-ignore
const getUsersThreadCount = (threadIds: Array<string>): Promise<Array<UserThreadCount>> => {
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

export type EditUserInput = {
  input: {
    file?: FileUpload,
    name?: string,
    description?: string,
    website?: string,
    coverFile?: FileUpload,
    username?: string,
    timezone?: number,
  },
};

const editUser = (args: EditUserInput, userId: string): Promise<DBUser> => {
  const {
    name,
    description,
    website,
    file,
    coverFile,
    username,
    timezone,
  } = args.input;

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
        modifiedAt: new Date(),
      });
    })
    .then(user => {
      if (file || coverFile) {
        if (file && !coverFile) {
          return uploadImage(file, 'users', user.id)
            .then(profilePhoto => {
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
                      trackQueue.add({
                        userId,
                        event: events.USER_EDITED,
                      });

                      identifyQueue.add({ userId: user.id });

                      return result.changes[0].new_val;
                    }

                    // an update was triggered from the client, but no data was changed
                    if (result.unchanged === 1) {
                      trackQueue.add({
                        userId,
                        event: events.USER_EDITED_FAILED,
                        properties: {
                          reason: 'no changes',
                        },
                      });

                      return result.changes[0].old_val;
                    }
                  })
              );
            })
            .catch(err => {
              console.error(err);
            });
        } else if (!file && coverFile) {
          return uploadImage(coverFile, 'users', user.id)
            .then(coverPhoto => {
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
                      trackQueue.add({
                        userId,
                        event: events.USER_EDITED,
                      });

                      identifyQueue.add({ userId: user.id });

                      return result.changes[0].new_val;
                    }

                    // an update was triggered from the client, but no data was changed
                    if (result.unchanged === 1) {
                      trackQueue.add({
                        userId,
                        event: events.USER_EDITED_FAILED,
                        properties: {
                          reason: 'no changes',
                        },
                      });

                      return result.changes[0].old_val;
                    }
                  })
              );
            })
            .catch(err => {
              console.error(err);
            });
        } else if (file && coverFile) {
          const uploadFile = file => {
            return uploadImage(file, 'users', user.id).catch(err => {
              console.error(err);
            });
          };

          const uploadCoverFile = coverFile => {
            return uploadImage(coverFile, 'users', user.id).catch(err => {
              console.error(err);
            });
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
                    trackQueue.add({
                      userId,
                      event: events.USER_EDITED,
                    });

                    identifyQueue.add({ userId: user.id });

                    return result.changes[0].new_val;
                  }

                  // an update was triggered from the client, but no data was changed
                  if (result.unchanged === 1) {
                    trackQueue.add({
                      userId,
                      event: events.USER_EDITED_FAILED,
                      properties: {
                        reason: 'no changes',
                      },
                    });

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
              trackQueue.add({
                userId,
                event: events.USER_EDITED,
              });

              identifyQueue.add({ userId: user.id });

              return result.changes[0].new_val;
            }

            // an update was triggered from the client, but no data was changed
            if (result.unchanged === 1) {
              trackQueue.add({
                userId,
                event: events.USER_EDITED_FAILED,
                properties: {
                  reason: 'no changes',
                },
              });
              return result.changes[0].old_val;
            }
          });
      }
    });
};

const setUserOnline = (id: string, isOnline: boolean): DBUser => {
  let data = {};

  data.isOnline = isOnline;
  data.lastSeen = new Date();
  return db
    .table('users')
    .get(id)
    .update(data, { returnChanges: 'always' })
    .run()
    .then(result => {
      if (result.changes[0].new_val) {
        const user = result.changes[0].new_val;
        return user;
      }
      return result.changes[0].old_val;
    });
};

// prettier-ignore
const setUserPendingEmail = (userId: string, pendingEmail: string): Promise<Object> => {
  return db
    .table('users')
    .get(userId)
    .update({
      pendingEmail,
    })
    .run()
    .then(async () => {
      const user = await getUserById(userId);
      if (user) {
        trackQueue.add({
          userId: user.id,
          event: events.USER_ADDED_EMAIL,
        });
      }

      return user
    });
};

const updateUserEmail = (userId: string, email: string): Promise<DBUser> => {
  return db
    .table('users')
    .get(userId)
    .update({
      email,
      pendingEmail: db.literal(),
    })
    .run()
    .then(async () => {
      const user = await getUserById(userId);
      if (user) {
        trackQueue.add({
          userId: user.id,
          event: events.USER_VERIFIED_EMAIL,
        });
      }
      return user;
    });
};

const deleteUser = (userId: string) => {
  return db
    .table('users')
    .get(userId)
    .update({
      username: null,
      email: null,
      deletedAt: new Date(),
      providerId: null,
      fbProviderId: null,
      googleProviderId: null,
      githubProviderId: null,
      githubUsername: null,
      profilePhoto: null,
      description: null,
      website: null,
      timezone: null,
      lastSeen: null,
      modifiedAt: null,
      firstName: null,
      lastName: null,
      pendingEmail: null,
      name: 'Deleted',
    })
    .run()
    .then(async () => {
      const user = await getUserById(userId);
      if (user) {
        trackQueue.add({
          userId: user.id,
          event: events.USER_DELETED,
        });

        identifyQueue.add({ userId: user.id });
      }

      return user;
    });
};

module.exports = {
  getUserById,
  getUserByEmail,
  getUserByUsername,
  getUsersByUsername,
  getUsersThreadCount,
  getUsers,
  getUserByIndex,
  saveUserProvider,
  createOrFindUser,
  storeUser,
  editUser,
  getEverything,
  setUserOnline,
  setUserPendingEmail,
  updateUserEmail,
  deleteUser,
};
