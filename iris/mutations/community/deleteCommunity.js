// @flow
import type { GraphQLContext } from '../../';
import UserError from '../../utils/UserError';

export default (_, { communityId }, { user }) => {
  const currentUser = user;

  // user must be authed to delete a community
  if (!currentUser) {
    return new UserError(
      'You must be signed in to make changes to this community.'
    );
  }

  const currentUserCommunityPermissions = getUserPermissionsInCommunity(
    communityId,
    currentUser.id
  );
  const communities = getCommunities([communityId]);

  return (
    Promise.all([currentUserCommunityPermissions, communities])
      .then(([currentUserCommunityPermissions, communities]) => {
        const communityToEvaluate = communities[0];

        // if no community was found or was deleted
        if (!communityToEvaluate || communityToEvaluate.deletedAt) {
          return new UserError("This community doesn't exist.");
        }

        // user must own the community to delete the community
        if (!currentUserCommunityPermissions.isOwner) {
          return new UserError(
            "You don't have permission to make changes to this community."
          );
        }

        // delete the community requested from the client
        const deleteTheInputCommunity = deleteCommunity(communityId);
        // get all the threads in the community to prepare for deletion
        const getAllThreadsInCommunity = getThreadsByCommunity(communityId);
        // remove all the UsersCommunities objects in the db
        const removeRelationshipsToCommunity = removeMembersInCommunity(
          communityId
        );
        // get all the channels in the community
        const getAllChannelsInCommunity = getChannelsByCommunity(communityId);

        return Promise.all([
          communityToEvaluate,
          deleteTheInputCommunity,
          getAllThreadsInCommunity,
          removeRelationshipsToCommunity,
          getAllChannelsInCommunity,
        ]);
      })
      .then(
        (
          [
            communityToEvaluate,
            deletedCommunity,
            allThreadsInCommunity,
            relationshipsToCommunity,
            allChannelsInCommunity,
          ]
        ) => {
          // after a community has been deleted, we need to mark all the channels
          // as deleted
          const removeAllChannels = allChannelsInCommunity.map(channel =>
            deleteChannel(channel.id)
          );
          // and remove all relationships to the deleted channels
          const removeAllRelationshipsToChannels = allChannelsInCommunity.map(
            channel => removeMembersInChannel(channel.id)
          );
          // and mark all the threads in that community as deleted
          const removeAllThreadsInCommunity = allThreadsInCommunity.map(
            thread => deleteThread(thread.id)
          );

          return Promise.all([
            communityToEvaluate,
            removeAllChannels,
            removeAllRelationshipsToChannels,
            removeAllThreadsInCommunity,
          ]);
        }
      )
      // return only the community that was being evaluated
      .then(data => data[0])
  );
};
