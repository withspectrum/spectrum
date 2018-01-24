// @flow
import type { DBCommunity } from 'shared/types';
import type { GraphQLContext } from '../../';
import type { PaginationOptions } from '../../utils/paginate-arrays';
import { encode, decode } from '../../utils/base64';
const { getMembersInCommunity } = require('../../models/usersCommunities');

export default (
  { id }: DBCommunity,
  { first = 10, after, role }: { ...$Exact<PaginationOptions>, role: string },
  { loaders }: GraphQLContext
) => {
  const cursor = decode(after);
  // Get the index from the encoded cursor, asdf234gsdf-2 => ["-2", "2"]
  const lastDigits = cursor.match(/-(\d+)$/);
  const lastUserIndex =
    lastDigits && lastDigits.length > 0 && parseInt(lastDigits[1], 10);

  // $FlowFixMe
  return getMembersInCommunity(id, { first, after: lastUserIndex }, role)
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
