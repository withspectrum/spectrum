// @flow
import type { DBUser } from 'shared/types';
import type { PaginationOptions } from 'api/utils/paginate-arrays';
import { encode, decode } from 'api/utils/base64';
import {
  getVisibleCommunitiesByUser,
  getPublicCommunitiesByUser,
  getCommunitiesByUser,
} from 'api/models/community';
import type { GraphQLContext } from '../../';

export default async (
  user: DBUser,
  args: PaginationOptions,
  ctx: GraphQLContext
) => {
  const evaluatingUserId = user.id;
  const { first = 5, after } = args;
  const { loaders, user: currentUser } = ctx;

  const cursor = decode(after);
  // Get the index from the encoded cursor, asdf234gsdf-2 => ["-2", "2"]
  const lastDigits = cursor.match(/-(\d+)$/);
  const lastCommunityIndex =
    (lastDigits && lastDigits.length > 0 && parseInt(lastDigits[1], 10)) || 0;

  let communities,
    forceNoPagination = false;
  if (!currentUser || !currentUser.id) {
    communities = await getPublicCommunitiesByUser(
      evaluatingUserId,
      lastCommunityIndex,
      first
    );
  } else if (evaluatingUserId === currentUser.id) {
    communities = await getCommunitiesByUser(
      currentUser.id,
      lastCommunityIndex,
      first
    );
  } else {
    forceNoPagination = true;
    communities = await getVisibleCommunitiesByUser(
      evaluatingUserId,
      currentUser.id,
      lastCommunityIndex,
      first
    );
  }

  return {
    pageInfo: {
      hasNextPage:
        !forceNoPagination && communities && communities.length > first,
    },
    edges: communities.map(async (community, index) => {
      const permissions = await loaders.userPermissionsInCommunity.load([
        user.id,
        community.id,
      ]);

      return {
        cursor: encode(`${community.id}-${lastCommunityIndex + index + 1}`),
        node: {
          ...community,
          contextPermissions: {
            communityId: community.id,
            reputation: permissions ? permissions.reputation : 0,
            isModerator: permissions ? permissions.isModerator : false,
            isOwner: permissions ? permissions.isOwner : false,
          },
        },
      };
    }),
  };
};
