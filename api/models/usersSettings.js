const { db } = require('shared/db');
import type { DBUserSettings } from 'shared/types';

export const createNewUsersSettings = (
  userId: string
): Promise<DBUserSettings> => {
  return db
    .table('usersSettings')
    .insert(
      {
        userId,
        notifications: {
          types: {
            newMessageInThreads: {
              email: true,
            },
            newMention: {
              email: true,
            },
            newDirectMessage: {
              email: true,
            },
            newThreadCreated: {
              email: true,
            },
            dailyDigest: {
              email: true,
            },
            weeklyDigest: {
              email: true,
            },
          },
        },
      },
      { returnChanges: 'always' }
    )
    .run()
    .then(res => res.changes[0].new_val);
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
      } else {
        return null;
      }
    });
};

export const disableAllUsersEmailSettings = (userId: string) => {
  return db
    .table('usersSettings')
    .getAll(userId, { index: 'userId' })
    .update({
      notifications: {
        types: {
          dailyDigest: {
            email: false,
          },
          newDirectMessage: {
            email: false,
          },
          newMention: {
            email: false,
          },
          newMessageInThreads: {
            email: false,
          },
          newThreadCreated: {
            email: false,
          },
          weeklyDigest: {
            email: false,
          },
        },
      },
    })
    .run();
};
