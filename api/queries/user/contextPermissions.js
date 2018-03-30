// @flow
/*

    DEPRECATED 2/3/2018 by @brian

*/
import type { GraphQLContext } from '../../';
import { getThread } from '../../models/thread';
import { getChannelById } from '../../models/channel';
import { getCommunities } from '../../models/community';

export default (user: any, _: any, { loaders }: GraphQLContext, info: any) => {
  // in some cases we fetch this upstream - e.g. in the case of querying for usersThreads, we need to fetch contextPermissions before we hit this step as threadIds are not included in the query variables
  if (user.contextPermissions) return user.contextPermissions;
  if (!info.operation.name) return null;
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
          isBlocked,
        } = await loaders.userPermissionsInCommunity.load([
          user.id,
          communityId,
        ]);
        return {
          isBlocked,
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
          isOwner,
          isBlocked,
          isModerator,
          isMember,
        } = await loaders.userPermissionsInCommunity.load([
          user.id,
          communityId,
        ]);
        return {
          communityId,
          isMember,
          isBlocked,
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
          isBlocked,
        } = await loaders.userPermissionsInCommunity.load([
          user.id,
          communityId,
        ]);
        return {
          isBlocked,
          communityId,
          reputation,
          isModerator,
          isOwner,
        };
      }
      case 'getCommunityTopMembers': {
        const communities = await getCommunities([info.variableValues.id]);
        const { id } = communities[0];
        const {
          reputation,
          isModerator,
          isOwner,
          isBlocked,
        } = await loaders.userPermissionsInCommunity.load([user.id, id]);
        return {
          communityId: id,
          reputation: reputation || 0,
          isModerator,
          isOwner,
          isBlocked,
        };
      }
      case 'search': {
        const communityId = info.variableValues.filter.communityId;
        if (!communityId) return null;
        const {
          reputation,
          isModerator,
          isMember,
          isBlocked,
          isOwner,
        } = await loaders.userPermissionsInCommunity.load([
          user.id,
          communityId,
        ]);
        return {
          communityId,
          reputation: reputation || 0,
          isModerator,
          isMember,
          isBlocked,
          isOwner,
        };
      }
    }
  };

  return handleCheck();
};
