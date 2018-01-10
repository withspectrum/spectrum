// @flow
import type { GraphQLContext } from '../../';
import UserError from '../../utils/UserError';

export default (_, { communityId }, { user }) => {
  const currentUser = user;

  // user must be authed to join a community
  if (!currentUser) {
    return new UserError('You must be signed in to join this community.');
  }

  // get the current user's permissions in the community
  const currentUserCommunityPermissions = getUserPermissionsInCommunity(
    communityId,
    currentUser.id
  );

  // get the community to evaluate
  const communities = getCommunities([communityId]);

  return Promise.all([
    currentUserCommunityPermissions,
    communities,
  ]).then(([currentUserCommunityPermissions, communities]) => {
    // select the community
    const communityToEvaluate = communities[0];

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
      // remove the relationship of the user to the community
      const removeRelationshipToCommunity = removeMemberInCommunity(
        communityId,
        currentUser.id
      );

      // returns an array of channel ids the user is a member of and public channels as well
      const getAllChannelsInCommunity = getChannelsByUserAndCommunity(
        communityId,
        currentUser.id
      );

      return Promise.all([
        communityToEvaluate,
        removeRelationshipToCommunity,
        getAllChannelsInCommunity,
      ]).then(
        (
          [
            communityToEvaluate,
            removedRelationshipToCommunity,
            allChannelsInCommunity,
          ]
        ) => {
          // remove all relationships to the community's channels
          const removeAllRelationshipsToChannels = Promise.all(
            allChannelsInCommunity.map(channel =>
              removeMemberInChannel(channel, currentUser.id)
            )
          );

          return (
            Promise.all([communityToEvaluate, removeAllRelationshipsToChannels])
              // return the community that was being evaluated
              .then(data => data[0])
          );
        }
      );
    } else {
      // the user is not a member of the current community, so create a new
      // relationship to the community and then create a relationship
      // with all default channels

      // make sure the user isn't blocked
      if (currentUserCommunityPermissions.isBlocked) {
        return new UserError(
          "You don't have permission to join this community."
        );
      }

      // create a new relationship to the community
      const joinCommunity = createMemberInCommunity(
        communityId,
        currentUser.id
      );

      return (
        Promise.all([
          communityToEvaluate,
          joinCommunity,
          // join the user to all the default channels in the community
          createMemberInDefaultChannels(communityId, currentUser.id),
        ])
          // return the evaluated cmomunity
          .then(data => data[0])
      );
    }
  });
};
