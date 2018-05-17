const { db } = require('./db');
import { events } from 'shared/analytics';
import { trackQueue } from 'shared/bull/queues';

export const createNewUsersSettings = (userId: string): Promise<Object> => {
  return db
    .table('usersSettings')
    .insert({
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
    })
    .run();
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

// prettier-ignore
export const updateUsersNotificationSettings = (userId: string, settings: object, type: string, method: string, enabled: string): Promise<Object> => {
  const event = enabled ? events.USER_NOTIFICATIONS_DISABLED : events.USER_NOTIFICATIONS_ENABLED
  
  trackQueue.add({
    userId,
    event,
    properties: {
      type,
      method,
    }
  })

  return db
    .table('usersSettings')
    .getAll(userId, { index: 'userId' })
    .update({
      ...settings,
    })
    .run();
};

// prettier-ignore
export const unsubscribeUserFromEmailNotification = (userId: string, type: object): Promise<Object> => {
  const obj = { notifications: { types: {} } };
  obj['notifications']['types'][type] = { email: false };

  trackQueue.add({
    userId,
    event: events.USER_NOTIFICATIONS_DISABLED,
    properties: {
      type: type,
      method: 'email'
    }
  })

  return db
    .table('usersSettings')
    .getAll(userId, { index: 'userId' })
    .update({ ...obj })
    .run();
};
