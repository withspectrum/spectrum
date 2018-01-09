// @flow
import type { DBCommunity } from 'shared/types';
import type { GraphQLContext } from '../../';

(community: DBCommunity, _: any, { loaders }: GraphQLContext, info: any) => {
  // in some cases we fetch this upstream - e.g. in the case of querying for communitysThreads, we need to fetch contextPermissions before we hit this step as threadIds are not included in the query variables
  if (community.contextPermissions) return community.contextPermissions;

  const queryName = info.operation.name.value;

  const handleCheck = async () => {
    switch (queryName) {
      case 'getUser': {
        const username = info.variableValues.username;
        const user = await loaders.userByUsername.load(username);
        const {
          reputation,
          isModerator,
          isOwner,
        } = await loaders.userPermissionsInCommunity.load([
          user.id,
          community.id,
        ]);
        return {
          communityId: community.id,
          reputation,
          isModerator,
          isOwner,
        };
      }
    }
  };

  return handleCheck();
};
