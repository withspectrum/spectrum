// @flow
import type { GraphQLContext } from '../../';
import type { PaginationOptions } from '../../utils/paginate-arrays';
import { getThreadsByChannel } from '../../models/thread';
import { encode, decode } from '../../utils/base64';
import { canViewChannel } from '../../utils/permissions';
import type { DBChannel } from 'shared/types';

export default async (
  channel: DBChannel,
  { first, after }: PaginationOptions,
  ctx: GraphQLContext
) => {
  const { id, isPrivate } = channel;
  const { loaders, user: currentUser } = ctx;

  if (isPrivate) {
    if (!(await canViewChannel(currentUser, id, loaders))) return null;
  }

  // $FlowFixMe
  return getThreadsByChannel(id, {
    first,
    after: after && parseInt(decode(after), 10),
  }).then(threads => ({
    pageInfo: {
      hasNextPage: threads.length >= first,
    },
    edges: threads.map(thread => ({
      cursor: encode(String(thread.lastActive.getTime())),
      node: thread,
    })),
  }));
};
