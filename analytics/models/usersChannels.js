// @flow
import type { DBUsersChannels } from 'shared/types';
import { db } from './db';

const defaultResult = {
  isMember: false,
  isOwner: false,
  isModerator: false,
  isBlocked: false,
  isPending: false,
  reputation: 0,
};

export const getUserPermissionsInChannel = (
  userId: string,
  channelId: string
): Promise<DBUsersChannels> => {
  return db
    .table('usersChannels')
    .getAll([userId, channelId], { index: 'userIdAndChannelId' })
    .run()
    .then(results => {
      if (!results || results.length === 0) return defaultResult;
      return results[0];
    });
};
