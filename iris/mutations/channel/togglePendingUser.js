// @flow
import type { GraphQLContext } from '../../';
import UserError from '../../utils/UserError';
import {
  getUserPermissionsInChannel,
  blockUserInChannel,
  approvePendingUserInChannel,
  createMemberInDefaultChannels,
} from '../../models/usersChannels';
import { getChannels } from '../../models/channel';
import {
  getUserPermissionsInCommunity,
  createMemberInCommunity,
} from '../../models/usersCommunities';

type TogglePendingUserInput = {
  input: {
    channelId: string,
    userId: string,
    action: 'approve' | 'block',
  },
};

export default async (
  _: any,
  { input }: TogglePendingUserInput,
  { user }: GraphQLContext
) => {
  const currentUser = user;

  // user must be authed to edit a channel
  if (!currentUser)
    return new UserError(
      'You must be signed in to make changes to this channel.'
    );

  const [
    currentUserChannelPermissions,
    evaluatedUserPermissions,
    channels,
  ] = await Promise.all([
    getUserPermissionsInChannel(input.channelId, currentUser.id),
    getUserPermissionsInChannel(input.channelId, input.userId),
    getChannels([input.channelId]),
  ]);

  // select the channel to be evaluated
  const channelToEvaluate = channels && channels[0];

  // if channel wasn't found or was deleted
  if (!channelToEvaluate || channelToEvaluate.deletedAt) {
    return new UserError("This channel doesn't exist");
  }

  // get the community parent of channel
  const currentUserCommunityPermissions = await getUserPermissionsInCommunity(
    channelToEvaluate.communityId,
    currentUser.id
  );

  // if the user isn't on the pending list
  if (!evaluatedUserPermissions.isPending) {
    return new UserError(
      'This user is not currently pending access to this channel.'
    );
  }

  // user is neither a community or channel owner, they don't have permission
  if (
    !currentUserChannelPermissions.isOwner ||
    !currentUserCommunityPermissions.isOwner
  ) {
    return new UserError(
      "You don't have permission to make changes to this channel."
    );
  }

  // all checks passed
  // determine whether to approve or block them
  if (input.action === 'block') {
    // remove the user from the pending list
    return blockUserInChannel(input.channelId, input.userId).then(
      () => channelToEvaluate
    );
  }

  if (input.action === 'approve') {
    const approveUser = approvePendingUserInChannel(
      input.channelId,
      input.userId
    );

    // if the user is a member of the parent community, we can return
    if (currentUserCommunityPermissions.isMember) {
      return Promise.all([channelToEvaluate, approveUser]).then(
        () => channelToEvaluate
      );
    } else {
      // if the user is not a member of the parent community,
      // join the community and the community's default channels
      return Promise.all([
        channelToEvaluate,
        createMemberInCommunity(channelToEvaluate.communityId, input.userId),
        createMemberInDefaultChannels(
          channelToEvaluate.communityId,
          input.userId
        ),
        approveUser,
      ]).then(() => channelToEvaluate);
    }
  }
};
