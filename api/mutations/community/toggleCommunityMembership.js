// @flow
/*

    DEPRECATED 2/1/2018 by @brian

*/
import type { GraphQLContext } from '../../';
import UserError from '../../utils/UserError';
import {
  getUserPermissionsInCommunity,
  createMemberInCommunity,
  removeMemberInCommunity,
} from '../../models/usersCommunities';
import { getCommunities } from '../../models/community';
import {
  createMemberInDefaultChannels,
  removeMemberInChannel,
} from '../../models/usersChannels';
import { getChannelsByUserAndCommunity } from '../../models/channel';

export default async (
  _: any,
  { communityId }: { communityId: string },
  { user }: GraphQLContext
) => {
  const currentUser = user;

  // user must be authed to join a community
  if (!currentUser) {
    return new UserError('You must be signed in to join this community.');
  }

  const [currentUserCommunityPermissions, communities] = await Promise.all([
    getUserPermissionsInCommunity(communityId, currentUser.id),
    getCommunities([communityId]),
  ]);

  // select the community
  const communityToEvaluate = communities && communities[0];

  // if community wasn't found or was deleted
  if (!communityToEvaluate || communityToEvaluate.deletedAt) {
    return new UserError("This community doesn't exist");
  }

  // user is blocked, they can't join the community
  if (currentUserCommunityPermissions.isBlocked) {
    return new UserError("You don't have permission to do that.");
  }

  // if the person owns the community, they have accidentally triggered
  // a join or leave action, which isn't allowed
  if (currentUserCommunityPermissions.isOwner) {
    return new UserError(
      "Owners of a community can't join or leave their own community."
    );
  }

  // if the user is a member of the community, it means they are trying
  // to leave the community
  if (currentUserCommunityPermissions.isMember) {
    const [
      // eslint-disable-next-line
      _,
      allChannelsInCommunity,
    ] = await Promise.all([
      removeMemberInCommunity(communityId, currentUser.id),
      getChannelsByUserAndCommunity(communityId, currentUser.id),
    ]);

    // remove all relationships to the community's channels
    const removeAllRelationshipsToChannels = Promise.all(
      allChannelsInCommunity.map(channel =>
        removeMemberInChannel(channel, currentUser.id)
      )
    );

    return await Promise.all([removeAllRelationshipsToChannels])
      // return the community that was being evaluated
      .then(() => communityToEvaluate);
  } else {
    // the user is not a member of the current community, so create a new
    // relationship to the community and then create a relationship
    // with all default channels

    // make sure the user isn't blocked
    if (currentUserCommunityPermissions.isBlocked) {
      return new UserError("You don't have permission to join this community.");
    }

    if (communityToEvaluate.redirect) {
      return new UserError('This community is no longer on Spectrum.');
    }

    return await Promise.all([
      createMemberInCommunity(communityId, currentUser.id),
      // join the user to all the default channels in the community
      createMemberInDefaultChannels(communityId, currentUser.id),
    ]).then(() => communityToEvaluate);
  }
};
