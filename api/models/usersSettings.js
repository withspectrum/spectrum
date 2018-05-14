const { db } = require('./db');

export const createNewUsersSettings = (userId: string): Promise<Object> => {
  return db.table('usersSettings').insert({
    userId,
    notifications: {
      types: {
        newMessageInThreads: {
          email: true,
          push: true,
        },
        newMention: {
          email: true,
          push: true,
        },
        newDirectMessage: {
          email: true,
          push: true,
        },
        newThreadCreated: {
          email: true,
          push: true,
        },
        dailyDigest: {
          email: true,
          push: true,
        },
        weeklyDigest: {
          email: true,
          push: true,
        },
      },
    },
  });
};

export const getUsersSettings = (userId: string): Promise<Object> => {
  return db
    .table('usersSettings')
    .getAll(userId, { index: 'userId' })
    .run()
    .then(results => {
      if (results && results.length > 0) {
        // if the user already has a relationship with the thread we don't need to do anything, return
        return results[0];
      }
    });
};

export const updateUsersNotificationSettings = (
  userId: string,
  settings: object
): Promise<Object> => {
  return db
    .table('usersSettings')
    .getAll(userId, { index: 'userId' })
    .update({
      ...settings,
    })
    .run();
};

export const unsubscribeUserFromEmailNotification = (
  userId: string,
  type: object
): Promise<Object> => {
  const obj = { notifications: { types: {} } };
  obj['notifications']['types'][type] = { email: false };

  return db
    .table('usersSettings')
    .getAll(userId, { index: 'userId' })
    .update({ ...obj })
    .run();
};
