// @flow
import type { DBUser } from 'shared/types';
import { getCommunitiesByUser } from '../../models/community';
import type { GraphQLContext } from '../../';

export default (user: DBUser, _: any, { loaders }: GraphQLContext) => ({
  // Don't paginate communities and channels of a user
  pageInfo: {
    hasNextPage: false,
  },
  edges: getCommunitiesByUser(user.id).then(communities =>
    communities.map(async community => {
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
    })
  ),
});
