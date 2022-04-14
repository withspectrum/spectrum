// @flow
import { createReadQuery, createWriteQuery, db } from 'shared/db';
import { uploadImage } from 'api/utils/file-storage';
import { createNewUsersSettings } from 'api/models/usersSettings';
import { sendNewUserWelcomeEmailQueue, searchQueue } from 'shared/bull/queues';
import { deleteThread } from 'api/models/thread';
import { deleteMessage } from 'api/models/message';
import { removeUsersCommunityMemberships } from 'api/models/usersCommunities';
import { removeUsersChannelMemberships } from 'api/models/usersChannels';
import { disableAllThreadNotificationsForUser } from 'api/models/usersThreads';
import { disableAllUsersEmailSettings } from 'api/models/usersSettings';
import type { PaginationOptions } from 'api/utils/paginate-arrays';
import type { DBUser, FileUpload } from 'shared/types';

export const getUserById = createReadQuery((userId: string) => {
  // fallback for a bad id coming in that is a stringified user object
  if (userId[0] === '{') {
    let user = JSON.parse(userId);

    if (user.id) {
      return {
        query: db.table('users').get(user.id),
        tags: (user: ?DBUser) => (user ? [user.id] : []),
      };
    } else if (user.email) {
      return {
        query: db.table('users').getAll(user.email, { index: 'email' }),
        process: (users: ?Array<DBUser>) => (users && users[0]) || null,
        tags: (user: ?DBUser) => (user ? [user.id] : []),
      };
    } else if (user.username) {
      return {
        query: db.table('users').getAll(user.username, { index: 'username' }),
        process: (users: ?Array<DBUser>) => (users && users[0]) || null,
        tags: (user: ?DBUser) => (user ? [user.id] : []),
      };
    } else if (user.githubProviderId) {
      return {
        query: db
          .table('users')
          .getAll(user.githubProviderId, { index: 'githubProviderId' }),
        process: (users: ?Array<DBUser>) => (users && users[0]) || null,
        tags: (user: ?DBUser) => (user ? [user.id] : []),
      };
    } else if (user.googleProviderId) {
      return {
        query: db
          .table('users')
          .getAll(user.googleProviderId, { index: 'googleProviderId' }),
        process: (users: ?Array<DBUser>) => (users && users[0]) || null,
        tags: (user: ?DBUser) => (user ? [user.id] : []),
      };
    } else if (user.providerId) {
      return {
        query: db
          .table('users')
          .getAll(user.providerId, { index: 'providerId' }),
        process: (users: ?Array<DBUser>) => (users && users[0]) || null,
        tags: (user: ?DBUser) => (user ? [user.id] : []),
      };
    } else {
      console.error(
        `Couldn’t get meaningful user data from passport: ${userId}`
      );
      return null;
    }
  }

  // userId was not a stringified object
  return {
    query: db.table('users').get(userId),
    tags: () => [userId],
  };
});

export const getUserByEmail = createReadQuery((email: string) => ({
  query: db.table('users').getAll(email, { index: 'email' }),
  process: (users: ?Array<DBUser>) => (users && users[0]) || null,
  tags: (user: ?DBUser) => (user ? [user.id] : []),
}));

export const getUsersByEmail = createReadQuery((email: string) => ({
  query: db.table('users').getAll(email, { index: 'email' }),
  process: (users: Array<?DBUser>) => users,
  tags: (users: Array<?DBUser>) => (users ? users.map(u => u && u.id) : []),
}));

export const getUserByUsername = createReadQuery((username: string) => ({
  query: db.table('users').getAll(username, { index: 'username' }),
  process: (users: ?Array<DBUser>) => (users && users[0]) || null,
  tags: (user: ?DBUser) => (user ? [user.id] : []),
}));

export const getUsersByUsername = createReadQuery(
  (usernames: Array<string>) => ({
    query: db.table('users').getAll(...usernames, { index: 'username' }),
    tags: (users: ?Array<DBUser>) => (users ? users.map(({ id }) => id) : []),
  })
);

export const getUsers = createReadQuery((userIds: Array<string>) => ({
  query: db.table('users').getAll(...userIds),
  tags: (users: ?Array<DBUser>) => (users ? users.map(({ id }) => id) : []),
}));

export const storeUser = createWriteQuery((user: Object) => ({
  query: db
    .table('users')
    .insert(
      {
        ...user,
        modifiedAt: null,
        createdAt: new Date(),
        termsLastAcceptedAt: new Date(),
        lastSeen: new Date(),
      },
      { returnChanges: 'always' }
    )
    .run()
    .then(res => {
      const dbUser = res.changes[0].new_val || res.changes[0].old_val;
      sendNewUserWelcomeEmailQueue.add({ user: dbUser });

      if (dbUser.username) {
        searchQueue.add({
          id: dbUser.id,
          type: 'user',
          event: 'created',
        });
      }

      return Promise.all([dbUser, createNewUsersSettings(dbUser.id)]).then(
        ([dbUser]) => dbUser
      );
    }),
  invalidateTags: (user: DBUser) => [user.id],
}));

export const saveUserProvider = createWriteQuery(
  (
    userId: string,
    providerMethod: string,
    providerId: number,
    extraFields?: Object
  ) => ({
    query: db
      .table('users')
      .get(userId)
      .update(
        {
          [providerMethod]: providerId,
          ...extraFields,
        },
        { returnChanges: 'always' }
      )
      .run()
      .then(
        async ({
          changes,
        }: {
          changes: [{ new_val?: DBUser, old_val?: DBUser }],
        }) => {
          const user = changes[0].new_val || changes[0].old_val;
          if (!user)
            throw new Error(`Failed to update user with ID ${userId}.`);

          return user;
        }
      ),
    invalidateTags: (user: ?DBUser) => (user ? [user.id] : []),
  })
);

export const getUserByIndex = createReadQuery(
  (indexName: string, indexValue: string) => ({
    query: db.table('users').getAll(indexValue, { index: indexName }),
    process: (results: ?Array<DBUser>) => (results ? results[0] : null),
    tags: (user: ?DBUser) => (user ? [user.id] : []),
  })
);

// prettier-ignore
export const createOrFindUser = (user: Object, providerMethod: string): Promise<?DBUser> => {
  // if a user id gets passed in, we know that a user most likely exists and we just need to retrieve them from the db
  // if not, we need to create a new user
  let promise;
  if (user.id) {
    promise = getUserById(user.id);
  } else if (user[providerMethod]) {
    promise = getUserByIndex(providerMethod, user[providerMethod])
      .then(storedUser => {
          if (storedUser) {
            return storedUser;
          }

          return Promise.resolve(null);
        }
      );
  } else {
    promise = Promise.resolve(null);
  }

  return promise
    .then(storedUser => {
      // if a user is found with the providerId, return the user in the db
      if (storedUser && storedUser.id) {
        return Promise.resolve(storedUser);
      }
      
      // restrict new signups to github auth only
      if (providerMethod !== 'githubProviderId') return Promise.resolve(null)
      // if no user exists, create a new one with the oauth profile data
      return storeUser(user);
    })
    .catch(err => {
      if (user.id) {
        console.error(err);
        return null;
      }

      if (providerMethod !== 'githubProviderId') return null
      return storeUser(user);
    });
};

// prettier-ignore
export const getEverything = (userId: string, options: PaginationOptions): Promise<Array<any>> => {
  const { first, after } = options
  return db
    .table('usersChannels')
    .getAll([userId, "member"], [userId, "owner"], [userId, "moderator"], { index: 'userIdAndRole' })
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

type UserThreadCount = {
  id: string,
  count: number,
};

// prettier-ignore
export const getUsersThreadCount = (threadIds: Array<string>): Promise<Array<UserThreadCount>> => {
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

export const editUser = createWriteQuery(
  (args: EditUserInput, userId: string) => {
    const {
      name,
      description,
      website,
      file,
      coverFile,
      username,
      timezone,
    } = args.input;

    return {
      query: db
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
          if (user.username) {
            searchQueue.add({
              id: user.id,
              type: 'user',
              event: 'edited',
            });
          }

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
                          return result.changes[0].new_val;
                        }

                        // an update was triggered from the client, but no data was changed
                        if (result.unchanged === 1) {
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
                          return result.changes[0].new_val;
                        }

                        // an update was triggered from the client, but no data was changed
                        if (result.unchanged === 1) {
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
        }),
      invalidateTags: () => [userId],
    };
  }
);

export const setUserOnline = async (id: string, isOnline: boolean) => {
  return await db
    .table('users')
    .get(id)
    .update(
      {
        isOnline,
        lastSeen: new Date(),
      },
      { returnChanges: 'always' }
    )
    .run()
    .then(res => {
      const user = res.changes[0].new_val || res.changes[0].old_val;
      return user;
    });
};

export const setUserPendingEmail = createWriteQuery(
  (userId: string, pendingEmail: string) => ({
    query: db
      .table('users')
      .get(userId)
      .update(
        {
          pendingEmail,
        },
        { returnChanges: 'always' }
      )
      .run()
      .then(
        async ({
          changes,
        }: {
          changes: [{ new_val?: DBUser, old_val?: DBUser }],
        }) => {
          const user = changes[0].new_val || changes[0].old_val;
          if (!user)
            throw new Error(
              `Failed to set user pending email to ${pendingEmail} for user ${userId}.`
            );

          return user;
        }
      ),
    invalidateTags: () => [userId],
  })
);

export const updateUserEmail = createWriteQuery(
  (userId: string, email: string) => ({
    query: db
      .table('users')
      .get(userId)
      .update(
        {
          email,
          pendingEmail: db.literal(),
        },
        { returnChanges: 'always' }
      )
      .run()
      .then(
        async ({
          changes,
        }: {
          changes: [{ new_val?: DBUser, old_val?: DBUser }],
        }) => {
          const user = changes[0].new_val || changes[0].old_val;
          if (!user)
            throw new Error(
              `Failed to update user email to ${email} for user ${userId}.`
            );

          return user;
        }
      ),
    invalidateTags: () => [userId],
  })
);

export const deleteUser = createWriteQuery((userId: string) => ({
  query: db
    .table('users')
    .get(userId)
    .update(
      {
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
      },
      { returnChanges: 'always' }
    )
    .run()
    .then(
      async ({
        changes,
      }: {
        changes: [{ new_val?: DBUser, old_val?: DBUser }],
      }) => {
        const user = changes[0].new_val || changes[0].old_val;

        searchQueue.add({
          id: userId,
          type: 'user',
          event: 'deleted',
        });

        return user;
      }
    ),
  invalidateTags: () => [userId],
}));

/*
  Occasionally bad actors will show up on Spectrum and become toxic, spam communities, harass others, or violate our code of conduct. We have a safe way to ban these users in a way that respects the integrity of data across the rest of the database.
  Do NOT ever `.delete()` a user record from the database!!
*/
type BanUserType = {
  userId: string,
  reason: string,
  currentUserId: string,
};
export const banUser = createWriteQuery((args: BanUserType) => {
  const { userId, reason, currentUserId } = args;

  return {
    invalidateTags: () => [userId],
    query: db
      .table('users')
      .get(userId)
      .update({
        bannedAt: new Date(),
        bannedBy: currentUserId,
        bannedReason: reason,
        username: null,
        coverPhoto: null, // in case the photo is inappropriate
        profilePhoto: null, // in case the photo is inappropriate
      })
      .run()
      .then(async () => {
        /*  
          after the user object has been cleared, the user
          can no longer be searched for, messaged, or viewed
          so we can simply cleanup db data to ensure they are
          no longer listed as members of communities or channels
          and their DMs cant be seen by other users
        */

        searchQueue.add({
          id: userId,
          type: 'user',
          event: 'deleted',
        });

        const dmThreadIds = await db
          .table('usersDirectMessageThreads')
          .getAll(userId, { index: 'userId' })
          .map(row => row('threadId'))
          .run();

        let removeOtherParticipantsDmThreadIds, removeDMThreads;
        if (dmThreadIds && dmThreadIds.length > 0) {
          removeOtherParticipantsDmThreadIds = db
            .table('usersDirectMessageThreads')
            .getAll(...dmThreadIds, { index: 'threadId' })
            .update({ deletedAt: new Date() })
            .run();

          removeDMThreads = await db
            .table('directMessageThreads')
            .getAll(...dmThreadIds)
            .update({ deletedAt: new Date() })
            .run();
        }

        const publishedThreadIds = await db
          .table('threads')
          .getAll(userId, { index: 'creatorId' })
          .map(row => row('id'))
          .run();

        const deletePublishedThreadsPromises =
          publishedThreadIds && publishedThreadIds.length > 0
            ? publishedThreadIds.map(id => deleteThread(id, currentUserId))
            : [];

        const usersThreadsIds = await db
          .table('usersThreads')
          .getAll(userId, { index: 'userId' })
          .map(row => row('threadId'))
          .run();

        const usersMessagesIds = await db
          .table('messages')
          .getAll(...usersThreadsIds, { index: 'threadId' })
          .filter({ senderId: userId })
          .map(row => row('id'))
          .run();

        const deleteSentMessagesPromises =
          usersMessagesIds && usersMessagesIds.length > 0
            ? usersMessagesIds.map(id => deleteMessage(currentUserId, id))
            : [];

        return await Promise.all([
          removeUsersCommunityMemberships(userId),
          removeUsersChannelMemberships(userId),
          disableAllThreadNotificationsForUser(userId),
          disableAllUsersEmailSettings(userId),
          removeOtherParticipantsDmThreadIds,
          removeDMThreads,
          ...deletePublishedThreadsPromises,
          ...deleteSentMessagesPromises,
        ]);
      }),
  };
});
