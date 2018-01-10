// @flow
import type { PaginationOptions } from '../../utils/paginate-arrays';
import type { GraphQLContext } from '../../';
import { getMembersInChannel } from '../../models/usersChannels';
import { encode, decode } from '../../utils/base64';

export default (
  { id },
  { first, after }: PaginationOptions,
  { loaders }: GraphQLContext
) => {
  const cursor = decode(after);
  // Get the index from the encoded cursor, asdf234gsdf-2 => ["-2", "2"]
  const lastDigits = cursor.match(/-(\d+)$/);
  const lastUserIndex =
    lastDigits && lastDigits.length > 0 && parseInt(lastDigits[1], 10);

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
