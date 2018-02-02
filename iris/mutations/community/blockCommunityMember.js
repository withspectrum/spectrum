// @flow
import type { GraphQLContext } from '../../';
import UserError from '../../utils/UserError';
import { getCommunityById } from '../../models/community';
import { blockUserInChannel } from '../../models/usersChannels';
import { getChannelsByCommunity } from '../../models/channel';
import {
  blockUserInCommunity,
  checkUserPermissionsInCommunity,
} from '../../models/usersCommunities';

type Input = {
  input: {
    userId: string,
    communityId: string,
  },
};

export default async (_: any, { input }: Input, { user }: GraphQLContext) => {
  const currentUser = user;
  const { communityId, userId: userToEvaluateId } = input;

  if (!currentUser) {
    return new UserError(
      'You must be signed in to manage moderators in this community.'
    );
  }

  const [
    currentUserPermissions,
    userToEvaluatePermissions,
    community,
  ] = await Promise.all([
    checkUserPermissionsInCommunity(communityId, currentUser.id),
    checkUserPermissionsInCommunity(communityId, userToEvaluateId),
    getCommunityById(communityId),
  ]);

  if (!community || community.deletedAt) {
    return new UserError("We couldn't find that community.");
  }

  // if no permissions exist, the user performing this mutation isn't even
  // a member of this community
  if (!currentUserPermissions || currentUserPermissions.length === 0) {
    return new UserError('You must own this community to manage members.');
  }

  if (!userToEvaluatePermissions || userToEvaluatePermissions === 0) {
    return new UserError('This person is not a member of your community.');
  }

  const currentUserPermission = currentUserPermissions[0];
  const userToEvaluatePermission = userToEvaluatePermissions[0];

  if (!userToEvaluatePermission.isMember) {
    return new UserError('This person is not a member of your community.');
  }

  if (userToEvaluatePermission.isBlocked) {
    return new UserError('This person is already blocked in your community.');
  }

  if (!currentUserPermission.isOwner) {
    return new UserError('You must own this community to manage members.');
  }

  // all checks pass
  if (currentUserPermission.isOwner) {
    const channels = await getChannelsByCommunity(community.id);
    const channelIds = channels.map(c => c.id);
    const blockInChannelPromises = channelIds.map(
      async channelId => await blockUserInChannel(channelId, userToEvaluateId)
    );

    return await Promise.all([
      blockUserInCommunity(communityId, userToEvaluateId),
      blockInChannelPromises,
    ])
      .then(() => true)
      .catch(err => new UserError(err));
  }

  return new UserError(
    "We weren't able to process your request to block a member in this community."
  );
};
