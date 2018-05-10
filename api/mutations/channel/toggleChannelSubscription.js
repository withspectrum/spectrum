// @flow
import type { GraphQLContext } from '../../';
import UserError from '../../utils/UserError';
import { getChannelById } from '../../models/channel';
import { userIsMemberOfAnyChannelInCommunity } from '../../models/community';
import { removeMemberInCommunity } from '../../models/usersCommunities';
import {
  getUserPermissionsInChannel,
  removeMemberInChannel,
  createMemberInChannel,
  createOrUpdatePendingUserInChannel,
  createMemberInDefaultChannels,
} from '../../models/usersChannels';
import {
  getUserPermissionsInCommunity,
  createMemberInCommunity,
} from '../../models/usersCommunities';
import { sendPrivateChannelRequestQueue } from 'shared/bull/queues';
import { isAuthedResolver as requireAuth } from '../../utils/permissions';

type Input = {
  channelId: string,
};

export default requireAuth(async (_: any, args: Input, ctx: GraphQLContext) => {
  const { channelId } = args;
  const { user } = ctx;

  const [channelToEvaluate, currentUserChannelPermissions] = await Promise.all([
    getChannelById(channelId),
    getUserPermissionsInChannel(channelId, user.id),
  ]);

  // if channel wasn't found or was deleted
  if (!channelToEvaluate || channelToEvaluate.deletedAt) {
    return new UserError("This channel doesn't exist");
  }

  // user is blocked, they can't join the channel
  if (currentUserChannelPermissions.isBlocked) {
    return new UserError("You don't have permission to do that.");
  }

  // if the person owns the channel, they have accidentally triggered
  // a join or leave action, which isn't allowed
  if (currentUserChannelPermissions.isOwner) {
    return new UserError(
      "Owners of a community can't join or leave their own channel."
    );
  }

  // get the current user's permissions in the community
  const currentUserCommunityPermissions = await getUserPermissionsInCommunity(
    channelToEvaluate.communityId,
    user.id
  );

  if (
    currentUserCommunityPermissions &&
    currentUserCommunityPermissions.isBlocked
  ) {
    return new UserError('You have been blocked in this community');
  }

  // if the user is a member of the channel, it means they are trying
  // to leave the channel
  if (currentUserChannelPermissions.isMember) {
    // remove the relationship of the user to the channel
    const removeRelationship = removeMemberInChannel(channelId, user.id);

    return (
      Promise.all([channelToEvaluate, removeRelationship])
        .then(([channelToEvaluate, remove]) => {
          // check to see if the user is a member of any other channels
          // in that community. if they are, we can return. if they are
          // not a member of any other channels in that community then we
          // know that this is the *last* channel they are leaving and they
          // should also be removed from the parent community itself
          const isMemberOfAnotherChannel = userIsMemberOfAnyChannelInCommunity(
            channelToEvaluate.communityId,
            user.id
          );

          return Promise.all([channelToEvaluate, isMemberOfAnotherChannel]);
        })
        .then(([channelToEvaluate, isMemberOfAnotherChannel]) => {
          // if they are a member of another channel, we can continue
          if (isMemberOfAnotherChannel) {
            return Promise.all([channelToEvaluate]);
          } else {
            // otherwise if this is the last channel they are leaving
            // in that community, the user should also be removed from
            // the community
            return Promise.all([
              channelToEvaluate,
              removeMemberInCommunity(channelToEvaluate.communityId, user.id),
            ]);
          }
        })
        // return only channel that was being evaluated in the first place
        .then(data => data[0])
    );
  } else {
    // the user is not a member of the current channel, which means
    // that they are trying to join this channel.
    // we need to check a few things:
    // 1. if the channel is private, and the user is already pending,
    //    remove their relationship from the channel
    // 2. if the channel is private and the user is not already pending,
    //    create a new pending relationship with the channel

    // 1. user has already requested to join, so remove them from pending
    if (currentUserChannelPermissions.isPending) {
      return removeMemberInChannel(channelId, user.id);
    }

    // 2. if the channel is private, request to join - since this action
    // doesn't actually join the channel, we don't need to perform
    // the downstream checks to see if the user needs to join the parent
    // community - those actions will instead be handled when the channel
    // owner approves the user
    if (channelToEvaluate.isPrivate) {
      sendPrivateChannelRequestQueue.add({
        userId: user.id,
        channel: channelToEvaluate,
      });
      return createOrUpdatePendingUserInChannel(channelId, user.id);
    }

    // otherwise the channel is not private so the user can just join.
    // we'll create new usersChannels relationship
    const join = createMemberInChannel(channelId, user.id);

    // we also need to see if the user is a member of the parent community.
    // if they are, we can just continue
    // otherwise this tells us that the user is joining the community
    // for the first time so we will create that relationship, as well
    // as create relationships between the user and all the default
    // channels in that community

    return (
      Promise.all([channelToEvaluate, join])
        .then(([channelToEvaluate, joinedChannel]) => {
          // if the user is a member of the parent community, we can return
          if (currentUserCommunityPermissions.isMember) {
            return Promise.all([joinedChannel]);
          } else {
            // if the user is not a member of the parent community,
            // join the community and the community's default channels
            return Promise.all([
              joinedChannel,
              createMemberInCommunity(joinedChannel.communityId, user.id),
              createMemberInDefaultChannels(joinedChannel.communityId, user.id),
            ]);
          }
        })
        // return the channel being evaluated in the first place
        .then(data => data[0])
    );
  }
});
