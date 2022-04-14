// @flow
import type { PaginationOptions } from '../../utils/paginate-arrays';
import type { GraphQLContext } from '../../';
import type { DBChannel } from 'shared/types';
import { getMembersInChannel } from '../../models/usersChannels';
import { encode, decode } from '../../utils/base64';
import { canViewChannel } from '../../utils/permissions';

export default async (
  channel: DBChannel,
  { first, after }: PaginationOptions,
  ctx: GraphQLContext
) => {
  const { loaders, user: currentUser } = ctx;
  const { id, isPrivate } = channel;

  if (isPrivate) {
    if (!(await canViewChannel(currentUser, id, loaders))) return null;
  }

  const cursor = decode(after);
  // Get the index from the encoded cursor, asdf234gsdf-2 => ["-2", "2"]
  const lastDigits = cursor.match(/-(\d+)$/);
  const lastUserIndex =
    lastDigits && lastDigits.length > 0 && parseInt(lastDigits[1], 10);

  // $FlowIssue
  return getMembersInChannel(id, { first, after: lastUserIndex })
    .then(users => loaders.user.loadMany(users))
    .then(result => ({
      pageInfo: {
        hasNextPage: result && result.length >= first,
      },
      edges: result.filter(Boolean).map((user, index) => ({
        cursor: encode(`${user.id}-${lastUserIndex + index + 1}`),
        node: user,
      })),
    }));
};
