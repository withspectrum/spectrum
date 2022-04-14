// @flow
import type { DBCommunity } from 'shared/types';
import type { GraphQLContext } from '../../';
import UserError from '../../utils/UserError';
import { canModerateCommunity } from '../../utils/permissions';
import { getMessageCount } from '../../models/message';
import {
  getThreads,
  getThreadsByCommunityInTimeframe,
} from '../../models/thread';

export default async (
  { id }: DBCommunity,
  __: any,
  { user, loaders }: GraphQLContext
) => {
  const currentUser = user;

  if (!currentUser) {
    return new UserError('You must be signed in to continue.');
  }

  if (!(await canModerateCommunity(currentUser.id, id, loaders))) {
    return new UserError(
      'You must be a team member to view community analytics.'
    );
  }

  const threads = await getThreadsByCommunityInTimeframe(id, 'weekly');

  if (!threads || threads.length === 0)
    return { topThreads: [], newThreads: [] };

  const threadsWithMessageCounts = await Promise.all(
    threads.map(({ id }) =>
      getMessageCount(id).then(messageCount => ({
        id,
        messageCount,
      }))
    )
  );

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
};
