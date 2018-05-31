// @flow
/*

    DEPRECATED 2/3/2018 by @brian

*/
import type { DBCommunity } from 'shared/types';
import type { GraphQLContext } from '../../';
import type { PaginationOptions } from '../../utils/paginate-arrays';
import { encode, decode } from '../../utils/base64';
const { getMembersInCommunity } = require('../../models/usersCommunities');
import { canViewCommunity } from '../../utils/permissions';

type MemberConnectionFilterType = {
  isMember?: boolean,
  isOwner?: boolean,
  isModerator?: boolean,
  isPending?: boolean,
  isBlocked?: boolean,
};

type Args = {
  ...$Exact<PaginationOptions>,
  filter: MemberConnectionFilterType,
};

export default async (root: DBCommunity, args: Args, ctx: GraphQLContext) => {
  const { user, loaders } = ctx;
  const { id } = root;

  if (!await canViewCommunity(user, id, loaders)) {
    return {
      pageInfo: {
        hasNextPage: false,
      },
      edges: [],
    };
  }

  const { first = 10, after, filter } = args;

  const cursor = decode(after);
  // Get the index from the encoded cursor, asdf234gsdf-2 => ["-2", "2"]
  const lastDigits = cursor.match(/-(\d+)$/);
  const lastUserIndex =
    lastDigits && lastDigits.length > 0 && parseInt(lastDigits[1], 10);

  // $FlowFixMe
  return getMembersInCommunity(id, { first, after: lastUserIndex }, filter)
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
