// @flow
import type { DBUser } from 'shared/types';
import {
  getVisibleCommunitiesByUser,
  getPublicCommunitiesByUser,
  getCommunitiesByUser,
} from '../../models/community';
import type { GraphQLContext } from '../../';

export default async (user: DBUser, _: any, ctx: GraphQLContext) => {
  const evaluatingUserId = user.id;
  const { loaders, user: currentUser } = ctx;

  let communities;
  if (!currentUser || !currentUser.id) {
    communities = await getPublicCommunitiesByUser(evaluatingUserId);
  } else if (evaluatingUserId === currentUser.id) {
    communities = await getCommunitiesByUser(currentUser.id);
  } else {
    communities = await getVisibleCommunitiesByUser(
      evaluatingUserId,
      currentUser.id
    );
  }

  return {
    pageInfo: {
      hasNextPage: false,
    },
    edges: communities.map(async community => {
      const permissions = await loaders.userPermissionsInCommunity.load([
        user.id,
        community.id,
      ]);

      return {
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
