// @flow
import type { GraphQLContext } from '../../';
import { getThread } from '../../models/thread';
import { getChannelById } from '../../models/channel';
import { getCommunitiesBySlug } from '../../models/community';

export default (user: any, _: any, { loaders }: GraphQLContext, info: any) => {
  // in some cases we fetch this upstream - e.g. in the case of querying for usersThreads, we need to fetch contextPermissions before we hit this step as threadIds are not included in the query variables
  if (user.contextPermissions) return user.contextPermissions;
  const queryName = info.operation.name.value;
  const handleCheck = async () => {
    switch (queryName) {
      case 'getThread':
      case 'getThreadMessages': {
        const threadId = info.variableValues.id;
        const { communityId } = await getThread(threadId);
        const {
          reputation,
          isModerator,
          isOwner,
        } = await loaders.userPermissionsInCommunity.load([
          user.id,
          communityId,
        ]);
        return {
          communityId,
          reputation,
          isModerator,
          isOwner,
        };
      }
      case 'loadMoreCommunityMembers':
      case 'getCommunityMembers': {
        const communityId = info.variableValues.id;
        const {
          reputation,
          isModerator,
          isOwner,
        } = await loaders.userPermissionsInCommunity.load([
          user.id,
          communityId,
        ]);
        return {
          communityId,
          reputation,
          isModerator,
          isOwner,
        };
      }
      // eslint-disable-next-line
      case 'loadMoreCommunityMembers':
      case 'getChannelMembers': {
        const channelId = info.variableValues.id;
        const { communityId } = await getChannelById(channelId);
        const {
          reputation,
          isModerator,
          isOwner,
        } = await loaders.userPermissionsInCommunity.load([
          user.id,
          communityId,
        ]);
        return {
          communityId,
          reputation,
          isModerator,
          isOwner,
        };
      }
      case 'getCommunityTopMembers': {
        const communities = await getCommunitiesBySlug([
          info.variableValues.slug,
        ]);
        const { id } = communities[0];
        const {
          reputation,
          isModerator,
          isOwner,
        } = await loaders.userPermissionsInCommunity.load([user.id, id]);
        return {
          communityId: id,
          reputation: reputation || 0,
          isModerator,
          isOwner,
        };
      }
    }
  };

  return handleCheck();
};
