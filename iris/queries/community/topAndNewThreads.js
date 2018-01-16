// @flow
import type { DBCommunity } from 'shared/types';
import type { GraphQLContext } from '../../';
import UserError from '../../utils/UserError';
import { getMessageCount } from '../../models/message';
import {
  getThreads,
  getThreadsByCommunityInTimeframe,
} from '../../models/thread';

export default ({ id }: DBCommunity, __: any, { user }: GraphQLContext) => {
  const currentUser = user;

  if (!currentUser) {
    return new UserError('You must be signed in to continue.');
  }

  return getThreadsByCommunityInTimeframe(id, 'week').then(async threads => {
    if (!threads) return { topThreads: [], newThreads: [] };

    const messageCountPromises = threads.map(async ({ id }) => ({
      id,
      messageCount: await getMessageCount(id),
    }));

    // promise all the active threads and message counts
    const threadsWithMessageCounts = await Promise.all(messageCountPromises);

    const topThreads = threadsWithMessageCounts
      .filter(t => t.messageCount > 0)
      .sort((a, b) => {
        const bc = parseInt(b.messageCount, 10);
        const ac = parseInt(a.messageCount, 10);
        return bc <= ac ? -1 : 1;
      })
      .slice(0, 10)
      .map(t => t.id);

    const newThreads = threadsWithMessageCounts
      .filter(t => t.messageCount === 0)
      .map(t => t.id);

    return {
      topThreads: await getThreads([...topThreads]),
      newThreads: await getThreads([...newThreads]),
    };
  });
};
