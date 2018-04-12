// @flow
import { db } from './db';

export const deactiveUserEmailNotifications = async (email: string) => {
  const userId = await db
    .table('users')
    .getAll(email, { index: 'email' })
    .run()
    .then(data => {
      if (!data || data.length === 0) return null;
      return data[0].id;
    });

  if (!userId) return null;

  return await db
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
    });
};
