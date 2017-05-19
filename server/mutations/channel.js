// @flow
// $FlowFixMe
const { UserError } = require('graphql-errors');
import {
  getChannels,
  getChannelBySlug,
  editChannel,
  createChannel,
  deleteChannel,
  leaveChannel,
  joinChannel,
  addRequestToJoinChannel,
  removeRequestToJoinChannel,
  addBlockedUser,
  removeBlockedUser,
} from '../models/channel';
import {
  getCommunities,
  joinCommunity,
  leaveCommunity,
  userIsMemberOfCommunity,
  userIsMemberOfAnyChannelInCommunity,
  subscribeToDefaultChannels,
} from '../models/community';
import type {
  CreateChannelArguments,
  EditChannelArguments,
} from '../models/channel';

type Context = {
  user: Object,
};

module.exports = {
  Mutation: {
    createChannel: (
      _: any,
      args: CreateChannelArguments,
      { user }: Context
    ) => {
      const currentUser = user;
      // user must be authed to create a channel
      if (!currentUser)
        return new UserError(
          'You must be signed in to create a new community.'
        );

      // get the community the channel is being created under
      return (
        getCommunities([args.input.communityId])
          // return the communities
          .then(communities => {
            // select the community where the channel is being created
            const community = communities[0];

            // if the user does not own the community
            if (!(community.owners.indexOf(currentUser.id) > -1)) {
              return new UserError(
                "You don't have permission to create a channel in this community."
              );
            }

            return community;
          })
          .then(community => getChannelBySlug(args.input.slug, community.slug))
          .then(channel => {
            // a channel with the slug sent from the client already exists
            if (channel) {
              return new UserError('A channel with this slug already exists.');
            }

            // all checks passed
            return createChannel(args, currentUser.id);
          })
      );
    },
    deleteChannel: (
      _: any,
      { channelId }: { channelId: string },
      { user }: Context
    ) => {
      const currentUser = user;

      // user must be authed to delete a channel
      if (!currentUser)
        return new UserError(
          'You must be signed in to make changes to this channel.'
        );

      // get the channel being deleted
      return (
        getChannels([channelId])
          // return channels
          .then(channels => {
            // select the channel being deleted
            const channel = channels[0];

            // if channel wasn't found or was previously deleted
            if (!channel || channel.isDeleted) {
              return new UserError("Channel doesn't exist");
            }

            // get the community parent of the channel being deleted
            const communities = getCommunities([channel.communityId]);

            return Promise.all([channel, communities]);
          })
          .then(([channel, communities]) => {
            // select the community
            const community = communities[0];

            // determine the role in the channel and community
            const isCommunityOwner =
              community.owners.indexOf(currentUser.id) > -1;
            const isChannelOwner = channel.owners.indexOf(currentUser.id) > -1;

            // NOTE: This will need to change in the future if we have the concept
            // of moderator-owner channels where the community owner is not
            // listed as an owner of the channel. In today's code we mirror
            // the owners at time of channel creation
            if (isCommunityOwner || isChannelOwner) {
              // all checks passed
              return deleteChannel(channelId);
            } else {
              return new UserError(
                "You don't have permission to make changes to this channel"
              );
            }
          })
      );
    },
    editChannel: (_: any, args: EditChannelArguments, { user }: Context) => {
      const currentUser = user;
      // user must be authed to edit a channel
      if (!currentUser)
        return new UserError(
          'You must be signed in to make changes to this channel.'
        );

      // get the channel being edited
      return (
        getChannels([args.input.channelId])
          // return the channels
          .then(channels => {
            // select the channel
            const channel = channels[0];

            // if channel wasn't found or was deleted
            if (!channel || channel.isDeleted) {
              return new UserError("This channel doesn't exist");
            }

            // if user doesn't own the channel
            if (!(channel.owners.indexOf(currentUser.id) > -1)) {
              return new UserError(
                "You don't have permission to make changes to this channel."
              );
            }

            // get the community parent of the channel being edited
            const communities = getCommunities([channel.communityId]);

            return Promise.all([channel, communities]);
          })
          .then(([channel, communities]) => {
            // select the community
            const community = communities[0];

            // if user is doesn't own the community

            // NOTE: This will need to change in the future if we have the concept
            // of moderator-owner channels where the community owner is not
            // listed as an owner of the channel. In today's code we mirror
            // the owners at time of channel creation
            if (!(community.owners.indexOf(currentUser.id) > -1)) {
              return new UserError(
                "You don't have permission to make changes to this channel."
              );
            }

            // all checks passed
            return editChannel(args);
          })
      );
    },
    toggleChannelSubscription: (
      _: any,
      { channelId }: string,
      { user }: Context
    ) => {
      const currentUser = user;
      // user must be authed to join a channel
      if (!currentUser)
        return new UserError('You must be signed in to follow this channel.');

      // get the channel being edited
      return getChannels([channelId]).then(channels => {
        // select the channel
        const channel = channels[0];

        // if channel wasn't found or was deleted
        if (!channel || channel.isDeleted) {
          return new UserError("This channel doesn't exist");
        }

        // user is blocked
        if (channel.blockedUsers.indexOf(currentUser.id) > -1) {
          return new UserError("You don't have permission to do that.");
        }

        // if the person owns the channel, they have accidentally triggered
        // a join or leave action, which isn't allowed
        if (channel.owners.indexOf(currentUser.id) > -1) {
          return new UserError(
            "Owners of a community can't join or leave their own channel."
          );
        }

        // if the user is current following the channel
        if (channel.members.indexOf(currentUser.id) > -1) {
          // unsubscribe them from the channel
          return (
            leaveChannel(channelId, currentUser.id)
              .then(channel => {
                return Promise.all([
                  channel,

                  // we check to see if the user is part of any other channels
                  // in the community - returns a boolean
                  userIsMemberOfAnyChannelInCommunity(
                    channel.communityId,
                    currentUser.id
                  ),
                ]);
              })
              .then(([channel, isMemberOfAnotherChannel]) => {
                // if user is a member of another channel in the community,
                // continue
                if (isMemberOfAnotherChannel) {
                  return Promise.all([channel]);
                }

                // if user is not a member of any other channels in the community,
                // we can assume that they no longer want to be part of the community
                if (!isMemberOfAnotherChannel) {
                  // leave the community
                  return Promise.all([
                    channel,
                    leaveCommunity(channel.communityId, currentUser.id),
                  ]);
                }
              })
              // return the channel
              .then(data => data[0])
          );
        } else {
          // if the user is not currently following the channel, determine the privacy
          // of the channel, the user's pending state, and perform the corresponding action

          // user has already requested to join, so remove them from pending
          if (channel.pendingUsers.indexOf(currentUser.id) > -1) {
            return removeRequestToJoinChannel(channelId, currentUser.id);
          }

          // if the channel is private, request to join - since this action
          // doesn't actually join the channel, we don't need to perform
          // the downstream checks to see if the user needs to join the parent
          // community - those actions will instead be handled when the channel
          // owner approves the user
          if (channel.isPrivate) {
            return addRequestToJoinChannel(channelId, currentUser.id);
          }

          return (
            joinChannel(channelId, currentUser.id)
              .then(channel => {
                // check to see if the user is a member of the parent community
                // returns a boolean
                return Promise.all([
                  channel,
                  userIsMemberOfCommunity(channel.communityId, currentUser.id),
                ]);
              })
              .then(([channel, isMember]) => {
                // if the user is a member of the parent community, continue
                if (isMember) {
                  return Promise.all([channel]);
                }

                // if the user is not a member of the parent community,
                // join the community and the community's defualt channels
                // (currently just 'general')
                if (!isMember) {
                  return Promise.all([
                    channel,
                    joinCommunity(channel.communityId, currentUser.id),
                    subscribeToDefaultChannels(
                      channel.communityId,
                      currentUser.id
                    ),
                  ]);
                }
              })
              // return the channel
              .then(data => data[0])
          );
        }
      });
    },
    togglePendingUser: (_: any, { input }, { user }: Context) => {
      const currentUser = user;

      // user must be authed to edit a channel
      if (!currentUser)
        return new UserError(
          'You must be signed in to make changes to this channel.'
        );

      // get the channel being edited
      return (
        getChannels([input.channelId])
          // return the channels
          .then(channels => {
            // select the channel
            const channel = channels[0];

            // if channel wasn't found or was deleted
            if (!channel || channel.isDeleted) {
              return new UserError("This channel doesn't exist");
            }

            // if user doesn't own the channel
            if (!(channel.owners.indexOf(currentUser.id) > -1)) {
              return new UserError(
                "You don't have permission to make changes to this channel."
              );
            }

            // get the community parent of the channel being edited
            const communities = getCommunities([channel.communityId]);

            return Promise.all([channel, communities]);
          })
          .then(([channel, communities]) => {
            // select the community
            const community = communities[0];

            // if user is doesn't own the community

            // NOTE: This will need to change in the future if we have the concept
            // of moderator-owner channels where the community owner is not
            // listed as an owner of the channel. In today's code we mirror
            // the owners at time of channel creation
            if (!(community.owners.indexOf(currentUser.id) > -1)) {
              return new UserError(
                "You don't have permission to make changes to this channel."
              );
            }

            const { channelId, userId, action } = input;

            // if the user isn't on the pending list
            if (!(channel.pendingUsers.indexOf(userId) > -1)) {
              return new UserError(
                'This user is not currently pending access to this channel.'
              );
            }

            // user is in the pending list
            // determine whether to approve or block them
            if (action === 'block') {
              // remove the user from the pending list
              return removeRequestToJoinChannel(
                channelId,
                userId
              ).then(channel => {
                return addBlockedUser(channelId, userId);
              });
            }

            if (action === 'approve') {
              // remove the user from the pending list
              return (
                removeRequestToJoinChannel(channelId, userId)
                  // we have to determine if this is the first channel the user is
                  // joining in a community. if so, we will add them to the community
                  // and the community's default channels
                  .then(channel => {
                    // user is already in the community, and therefore is already
                    // in the default channels (general, for now)
                    // subscribe them to the approved channel
                    if (community.members.indexOf(userId) > -1) {
                      return joinChannel(channelId, userId);
                    } else {
                      // user is not in the community, so we need to add them to
                      // the community and the community's default channels
                      return (
                        Promise.all([
                          channel,
                          joinChannel(channelId, userId), // approve them in the current channel
                          joinCommunity(channel.communityId, userId), // join the parent community
                          subscribeToDefaultChannels(
                            // join the parent community's defaults
                            channel.communityId,
                            userId
                          ),
                        ])
                          // return the channel
                          .then(data => data[0])
                      );
                    }
                  })
              );
            }

            // invalid action type
            return new UserError('Unknown action request on a pending user.');
          })
      );
    },
    unblockUser: (_: any, { input }, { user }: Context) => {
      const currentUser = user;
      // user must be authed to edit a channel
      if (!currentUser)
        return new UserError(
          'You must be signed in to make changes to this channel.'
        );

      // get the channel being edited
      return (
        getChannels([input.channelId])
          // return the channels
          .then(channels => {
            // select the channel
            const channel = channels[0];

            // if channel wasn't found or was deleted
            if (!channel || channel.isDeleted) {
              return new UserError("This channel doesn't exist");
            }

            // if user doesn't own the channel
            if (!(channel.owners.indexOf(currentUser.id) > -1)) {
              return new UserError(
                "You don't have permission to make changes to this channel."
              );
            }

            // get the community parent of the channel being edited
            const communities = getCommunities([channel.communityId]);

            return Promise.all([channel, communities]);
          })
          .then(([channel, communities]) => {
            // select the community
            const community = communities[0];

            // if user is doesn't own the community

            // NOTE: This will need to change in the future if we have the concept
            // of moderator-owner channels where the community owner is not
            // listed as an owner of the channel. In today's code we mirror
            // the owners at time of channel creation
            if (!(community.owners.indexOf(currentUser.id) > -1)) {
              return new UserError(
                "You don't have permission to make changes to this channel."
              );
            }

            const { channelId, userId } = input;

            // if the user isn't on the pending list
            if (!(channel.blockedUsers.indexOf(userId) > -1)) {
              return new UserError(
                'This user is not currently blocked in this channel.'
              );
            }

            // all checks passed
            return removeBlockedUser(channelId, userId);
          })
      );
    },
  },
};
