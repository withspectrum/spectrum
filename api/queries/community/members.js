// @flow
import type { DBCommunity } from 'shared/types';
import type { GraphQLContext } from '../../';
import type { PaginationOptions } from '../../utils/paginate-arrays';
import { encode, decode } from '../../utils/base64';
import { canViewCommunity } from '../../utils/permissions';
import {
  getMembersInCommunity,
  getOwnersInCommunity,
  getModeratorsInCommunity,
  getTeamMembersInCommunity,
  getPendingUsersInCommunity,
  getBlockedUsersInCommunity,
} from '../../models/usersCommunities';

type MembersFilterType = {
  isMember?: boolean,
  isOwner?: boolean,
  isModerator?: boolean,
  isPending?: boolean,
  isBlocked?: boolean,
};

type Args = {
  ...$Exact<PaginationOptions>,
  filter?: MembersFilterType,
};

export default async (root: DBCommunity, args: Args, ctx: GraphQLContext) => {
  const { id } = root;
  const { user, loaders } = ctx;

  if (!(await canViewCommunity(user, id, loaders))) {
    return {
      pageInfo: {
        hasNextPage: false,
      },
      edges: [],
    };
  }

  const { first = 10, after, filter = {} } = args;
  const cursor = decode(after);
  // Get the index from the encoded cursor, asdf234gsdf-2 => ["-2", "2"]
  const lastDigits = cursor.match(/-(\d+)$/);
  const lastUserIndex =
    (lastDigits && lastDigits.length > 0 && parseInt(lastDigits[1], 10)) || 0;

  let query;
  if (filter.isBlocked) {
    query = getBlockedUsersInCommunity;
  } else if (filter.isPending) {
    query = getPendingUsersInCommunity;
  } else if (filter.isModerator && filter.isOwner) {
    query = getTeamMembersInCommunity;
  } else if (filter.isModerator) {
    query = getModeratorsInCommunity;
  } else if (filter.isOwner) {
    query = getOwnersInCommunity;
  } else {
    query = getMembersInCommunity;
  }

  return query(id, { first, after: lastUserIndex })
    .then(users => {
      const permissionsArray = users.map(userId => [userId, id]);
      // $FlowIssue
      return loaders.userPermissionsInCommunity.loadMany(permissionsArray);
    })
    .then(result => ({
      pageInfo: {
        hasNextPage: result && result.length >= first,
      },
      edges: result.filter(Boolean).map((user, index) => ({
        cursor: encode(`${user.userId}-${lastUserIndex + index + 1}`),
        node: user,
      })),
    }));
};
