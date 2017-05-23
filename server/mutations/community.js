// @flow
// $FlowFixMe
const { UserError } = require('graphql-errors');
import {
  createCommunity,
  editCommunity,
  deleteCommunity,
  getCommunities,
  getCommunitiesBySlug,
  unsubscribeFromAllChannelsInCommunity,
} from '../models/community';
import {
  createGeneralChannel,
  getChannelsByCommunity,
  deleteChannel,
} from '../models/channel';
import {
  createMemberInDefaultChannels,
  createOwnerInChannel,
  removeMembersInChannel,
} from '../models/usersChannels';
import {
  createOwnerInCommunity,
  removeMembersInCommunity,
  getUserPermissionsInCommunity,
} from '../models/usersCommunities';
import type {
  CreateCommunityArguments,
  EditCommunityArguments,
} from '../models/community';
import { getThreadsByCommunity, deleteThread } from '../models/thread';

module.exports = {
  Mutation: {
    createCommunity: (_, args: CreateCommunityArguments, { user }) => {
      const currentUser = user;
      // user must be authed to create a community
      if (!currentUser) {
        return new UserError(
          'You must be signed in to create a new community.'
        );
      }

      // get communities with the input slug to check for duplicates
      return (
        getCommunitiesBySlug([args.input.slug])
          .then(communities => {
            // if a community with this slug already exists
            if (communities.length > 0) {
              return new UserError(
                'A community with this slug already exists.'
              );
            }
            // all checks passed
            return createCommunity(args, currentUser.id);
          })
          .then(community => {
            // create a new relationship with the community
            const communityRelationship = createOwnerInCommunity(
              community.id,
              currentUser.id
            );

            // create a default 'general' channel
            const generalChannel = createGeneralChannel(community.id);

            return Promise.all([
              community,
              communityRelationship,
              generalChannel,
            ]);
          })
          .then(([community, communityRelationship, generalChannel]) => {
            // create a new relationship with the general channel
            const generalChannelRelationship = createOwnerInChannel(
              generalChannel.id,
              currentUser.id
            );

            return Promise.all([community, generalChannelRelationship]);
          })
          // return only the newly created community
          .then(data => data[0])
      );
    },
    deleteCommunity: (_, { communityId }, { user }) => {
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
            const getAllChannelsInCommunity = getChannelsByCommunity(
              communityId
            );

            return Promise.all([
              communityToEvaluate,
              deleteTheInputCommunity,
              getAllThreadsInCommunity,
              removeRelationshipsToCommunity,
              getAllChannelsInCommunity,
            ]);
          })
          .then(([
            communityToEvaluate,
            deletedCommunity,
            allThreadsInCommunity,
            relationshipsToCommunity,
            allChannelsInCommunity,
          ]) => {
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
          })
          // return only the community that was being evaluated
          .then(data => data[0])
      );
    },
    editCommunity: (
      _: any,
      args: EditCommunityArguments,
      { user }: Context
    ) => {
      const currentUser = user;

      // user must be authed to edit a community
      if (!currentUser)
        return new UserError(
          'You must be signed in to make changes to this community.'
        );

      // get the community being modified
      return getCommunities([args.input.communityId]).then(communities => {
        // select the community returned
        const community = communities[0];

        // if no community was found or was deleted
        if (!community || community.deletedAt) {
          return new UserError("This community doesn't exist.");
        }

        // user must own the community to edit the community
        if (!(community.owners.indexOf(currentUser.id) > -1)) {
          return new UserError(
            "You don't have permission to make changes to this community."
          );
        }

        // all checks passed
        return editCommunity(args);
      });
    },
    toggleCommunityMembership: (
      _: any,
      { communityId }: { communityId: string },
      { user }: Context
    ) => {
      const currentUser = user;

      // user must be authed to join a community
      if (!currentUser)
        return new UserError('You must be signed in to join this community.');

      // get the community
      return getCommunities([communityId]).then(communities => {
        // select the community returned
        const community = communities[0];

        // if no community was found or was deleted
        if (!community || community.deletedAt) {
          return new UserError("This community doesn't exist.");
        }

        // if the person owns the community, they have accidentally triggered
        // a join or leave action, which isn't allowed
        if (community.owners.indexOf(currentUser.id) > -1) {
          return new UserError(
            "Owners of a community can't join or leave their own community."
          );
        }

        // if the user is a member of the community
        if (community.members.indexOf(currentUser.id) > -1) {
          // leave the community
          return (
            leaveCommunity(communityId, currentUser.id)
              // then pass the community downstream
              .then(community => {
                return Promise.all([
                  community,
                  // selects all channels in the community and leaves them
                  unsubscribeFromAllChannelsInCommunity(
                    communityId,
                    currentUser.id
                  ),
                ]);
              })
              // return the community to the client
              .then(data => data[0])
          );
        } else {
          // if the user is not a member of the community
          return (
            // join the community
            joinCommunity(communityId, currentUser.id)
              // then pass the community downstream
              .then(community => {
                return Promise.all([
                  community,
                  // currently subscribes the user to the 'general' channel
                  subscribeToDefaultChannels(communityId, currentUser.id),
                ]);
              })
              // return the community to the client
              .then(data => data[0])
          );
        }
      });
    },
  },
};
