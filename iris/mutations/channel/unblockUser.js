// @flow
import type { GraphQLContext } from '../../';
import UserError from '../../utils/UserError';

type UnblockUserInput = {
  channelId: string,
  userId: string,
};

export default (
  _: any,
  { input }: UnblockUserInput,
  { user }: GraphQLContext
) => {
  const currentUser = user;

  // user must be authed to edit a channel
  if (!currentUser) {
    return new UserError(
      'You must be signed in to make changes to this channel.'
    );
  }

  // get the current user's permission in the channel

  // get the current user's permission in the channel
  const currentUserChannelPermissions = getUserPermissionsInChannel(
    input.channelId,
    currentUser.id
  );
  const evaluatedUserChannelPermissions = getUserPermissionsInChannel(
    input.channelId,
    input.userId
  );

  // get the channel being edited
  const channels = getChannels([input.channelId]);

  return Promise.all([
    currentUserChannelPermissions,
    evaluatedUserChannelPermissions,
    channels,
  ])
    .then(
      (
        [
          currentUserChannelPermissions,
          evaluatedUserChannelPermissions,
          channels,
        ]
      ) => {
        // get the channel to evaluate
        const channelToEvaluate = channels[0];

        // if channel wasn't found or was deleted
        if (!channelToEvaluate || channelToEvaluate.deletedAt) {
          return new UserError("This channel doesn't exist");
        }

        const currentUserCommunityPermissions = getUserPermissionsInCommunity(
          channelToEvaluate.communityId,
          currentUser.id
        );
        return Promise.all([
          currentUserChannelPermissions,
          evaluatedUserChannelPermissions,
          channelToEvaluate,
          currentUserCommunityPermissions,
        ]);
      }
    )
    .then(
      (
        [
          currentUserChannelPermissions,
          evaluatedUserChannelPermissions,
          channelToEvaluate,
          currentUserCommunityPermissions,
        ]
      ) => {
        if (!evaluatedUserChannelPermissions.isBlocked) {
          return new UserError(
            'This user is not currently blocked in this channel.'
          );
        }

        // if a user owns the community or owns the channel, they can make this change
        if (
          currentUserChannelPermissions.isOwner ||
          currentUserCommunityPermissions.isOwner
        ) {
          return unblockMemberInChannel(input.channelId, input.userId).then(
            () => channelToEvaluate
          );
        }

        // user is neither a community or channel owner, they don't have permission
        return new UserError(
          "You don't have permission to make changes to this channel."
        );
      }
    );
};
