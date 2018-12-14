// @flow
import { db } from 'shared/db';

export const deactivateUserEmailNotifications = async (userId: string) => {
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
