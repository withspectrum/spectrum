// @flow
// $FlowFixMe
import UserError from '../utils/UserError';
import {
  getChannels,
  getChannelBySlug,
  editChannel,
  createChannel,
  deleteChannel,
} from '../models/channel';
import {
  getCommunities,
  userIsMemberOfCommunity,
  userIsMemberOfAnyChannelInCommunity,
} from '../models/community';
import {
  getUserPermissionsInCommunity,
  createMemberInCommunity,
  removeMemberInCommunity,
} from '../models/usersCommunities';
import {
  getUserPermissionsInChannel,
  createMemberInChannel,
  removeMemberInChannel,
  removeMembersInChannel,
  createOwnerInChannel,
  createPendingUserInChannel,
  createMemberInDefaultChannels,
  blockUserInChannel,
  approvePendingUserInChannel,
  approvePendingUsersInChannel,
} from '../models/usersChannels';
import type {
  CreateChannelArguments,
  EditChannelArguments,
} from '../models/channel';
import { getThreadsByChannel, deleteThread } from '../models/thread';

type Context = {
  user: Object,
};

module.exports = {
  Mutation: {
    createChannel: (_, args, { user }) => {
      const currentUser = user;

      // user must be authed to create a channel
      if (!currentUser) {
        return new UserError(
          'You must be signed in to create a new community.'
        );
      }

      // get the community parent where the channel is being created
      const communities = getCommunities([args.input.communityId]);

      // get the permission of the user in the parent community
      const currentUserCommunityPermissions = getUserPermissionsInCommunity(
        args.input.communityId,
        currentUser.id
      );

      return (
        Promise.all([communities, currentUserCommunityPermissions])
          .then(([communities, currentUserCommunityPermissions]) => {
            // select the community to evaluate
            const communityToEvaluate = communities[0];

            // if there is no community being evaluated, we can assume the
            // community doesn't exist any more
            if (!communityToEvaluate) {
              return new UserError(
                "You don't have permission to create a channel in this community."
              );
            }

            // if the current user is not the owner of the parent community
            // they can not create channels
            if (!currentUserCommunityPermissions.isOwner) {
              return new UserError(
                "You don't have permission to create a channel in this community."
              );
            }

            const channelWithSlug = getChannelBySlug(
              args.input.slug,
              communityToEvaluate.slug
            );

            return Promise.all([channelWithSlug]);
          })
          .then(([channelWithSlug]) => {
            // if a channel is returned, it means a duplicate was being created
            // so we need to escape
            if (channelWithSlug) {
              return new UserError('A channel with this slug already exists.');
            }

            // if no channel was returned, it means we are creating a unique
            // new channel and can proceed
            return createChannel(args, currentUser.id);
          })
          .then(channel => {
            // once the channel is created, create the user's relationship with
            // the new channel
            return Promise.all([
              channel,
              createOwnerInChannel(channel.id, currentUser.id),
            ]);
          })
          // return the channel object that was created
          .then(data => data[0])
      );
    },
    deleteChannel: (_, { channelId }, { user }) => {
      const currentUser = user;

      // user must be authed to delete a channel
      if (!currentUser) {
        return new UserError(
          'You must be signed in to make changes to this channel.'
        );
      }

      // get the channel's permissions
      const currentUserChannelPermissions = getUserPermissionsInChannel(
        channelId,
        currentUser.id
      );

      // get the channel to evaluate
      const channels = getChannels([channelId]);

      return Promise.all([currentUserChannelPermissions, channels])
        .then(([currentUserChannelPermissions, channels]) => {
          // select the channel to evaluate
          const channelToEvaluate = channels[0];

          // if channel wasn't found or was previously deleted, something
          // has gone wrong and we need to escape
          if (!channelToEvaluate || channelToEvaluate.deletedAt) {
            return new UserError("Channel doesn't exist");
          }

          // get the community parent of the channel being deleted
          const currentUserCommunityPermissions = getUserPermissionsInCommunity(
            channelToEvaluate.communityId,
            currentUser.id
          );

          return Promise.all([
            currentUserChannelPermissions,
            currentUserCommunityPermissions,
          ]);
        })
        .then(([
          currentUserChannelPermissions,
          currentUserCommunityPermissions,
        ]) => {
          // if the currentUser is either a community owner or channel owner,
          // they are allowed delete the channel
          if (
            currentUserCommunityPermissions.isOwner ||
            currentUserChannelPermissions.isOwner
          ) {
            // all checks passed
            // delete the channel requested from the client side user
            const deleteTheInputChannel = deleteChannel(channelId);
            // get all the threads in the channel to prepare for deletion
            const getAllThreadsInChannel = getThreadsByChannel(channelId);
            // update all the UsersChannels objects in the db to be non-members
            const removeRelationships = removeMembersInChannel(channelId);

            return Promise.all([
              deleteTheInputChannel,
              getAllThreadsInChannel,
              removeRelationships,
            ]).then(([
              deletedInputChannel,
              allThreadsInChannel,
              removedRelationships,
            ]) => {
              // if there were no threads in that channel, we are done
              if (allThreadsInChannel.length === 0) return;

              // otherwise we need to mark all the threads in that channel
              // as deleted
              return allThreadsInChannel.map(thread => deleteThread(thread.id));
            });
          } else {
            // if the currentUser does not own the channel or the parent
            // community they can not delete the channel
            return new UserError(
              "You don't have permission to make changes to this channel"
            );
          }
        });
    },
    editChannel: (_, args: EditChannelArguments, { user }) => {
      const currentUser = user;

      // user must be authed to edit a channel
      if (!currentUser) {
        return new UserError(
          'You must be signed in to make changes to this channel.'
        );
      }

      // get the user's permission in this channel
      const currentUserChannelPermissions = getUserPermissionsInChannel(
        args.input.channelId,
        currentUser.id
      );

      // get the channel to evaluate
      const channels = getChannels([args.input.channelId]);

      return Promise.all([currentUserChannelPermissions, channels])
        .then(([currentUserChannelPermission, channels]) => {
          // select the channel to evaluate
          const channelToEvaluate = channels[0];

          // if a channel wasn't found or was deleted
          if (!channelToEvaluate || channelToEvaluate.deletedAt) {
            return new UserError("This channel doesn't exist");
          }

          // get the community parent of the channel being deleted
          const currentUserCommunityPermissions = getUserPermissionsInCommunity(
            channelToEvaluate.communityId,
            currentUser.id
          );

          return Promise.all([
            channelToEvaluate,
            currentUserChannelPermissions,
            currentUserCommunityPermissions,
          ]);
        })
        .then(([
          channelToEvaluate,
          currentUserChannelPermissions,
          currentUserCommunityPermissions,
        ]) => {
          // if the user owns the community or owns the channel, they
          // are allowed to make the changes
          if (
            currentUserCommunityPermissions.isOwner ||
            currentUserChannelPermissions.isOwner
          ) {
            // all checks passed
            // if a channel is being converted from private to public, make
            // all the pending users members in the channel
            if (channelToEvaluate.isPrivate && !args.input.isPrivate) {
              approvePendingUsersInChannel(args.input.channelId);
            }

            return editChannel(args);
          }

          // otherwise the user does not have permission
          return new UserError(
            "You don't have permission to make changes to this channel."
          );
        });
    },
    toggleChannelSubscription: (_, { channelId }, { user }) => {
      const currentUser = user;

      // user must be authed to join a channel
      if (!currentUser) {
        return new UserError('You must be signed in to follow this channel.');
      }

      // get the current user's permissions in the channel
      const currentUserChannelPermissions = getUserPermissionsInChannel(
        channelId,
        currentUser.id
      );

      // get the channel to evaluate
      const channels = getChannels([channelId]);

      return Promise.all([currentUserChannelPermissions, channels]).then(([
        currentUserChannelPermissions,
        channels,
      ]) => {
        // select the channel
        const channelToEvaluate = channels[0];

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

        // if the user is a member of the channel, it means they are trying
        // to leave the channel
        if (currentUserChannelPermissions.isMember) {
          // remove the relationship of the user to the channel
          const removeRelationship = removeMemberInChannel(
            channelId,
            currentUser.id
          );

          // check to see if the user is a member of any other channels
          // in that community. if they are, we can return. if they are
          // not a member of any other channels in that community then we
          // know that this is the *last* channel they are leaving and they
          // should also be removed from the parent community itself
          const isMemberOfAnotherChannel = userIsMemberOfAnyChannelInCommunity(
            channelToEvaluate.communityId,
            currentUser.id
          );

          return (
            Promise.all([
              channelToEvaluate,
              removeRelationship,
              isMemberOfAnotherChannel,
            ])
              .then(([channelToEvaluate, remove, isMemberOfAnotherChannel]) => {
                // if they are a member of another channel, we can continue
                if (isMemberOfAnotherChannel) {
                  return Promise.all([channelToEvaluate]);
                } else {
                  // otherwise if this is the last channel they are leaving
                  // in that community, the user should also be removed from
                  // the community
                  return Promise.all([
                    channelToEvaluate,
                    removeMemberInCommunity(
                      channelToEvaluate.communityId,
                      currentUser.id
                    ),
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
            return removeMemberInChannel(channelId, currentUser.id);
          }

          // 2. if the channel is private, request to join - since this action
          // doesn't actually join the channel, we don't need to perform
          // the downstream checks to see if the user needs to join the parent
          // community - those actions will instead be handled when the channel
          // owner approves the user
          if (channelToEvaluate.isPrivate) {
            return createPendingUserInChannel(channelId, currentUser.id);
          }

          // otherwise the channel is not private so the user can just join.
          // we'll create new usersChannels relationship
          const join = createMemberInChannel(channelId, currentUser.id);

          // we also need to see if the user is a member of the parent community.
          // if they are, we can just continue
          // otherwise this tells us that the user is joining the community
          // for the first time so we will create that relationship, as well
          // as create relationships between the user and all the default
          // channels in that community

          // get the current user's permissions in the community
          const currentUserCommunityPermissions = getUserPermissionsInCommunity(
            channelToEvaluate.communityId,
            currentUser.id
          );

          return (
            Promise.all([
              channelToEvaluate,
              join,
              currentUserCommunityPermissions,
            ])
              .then(([
                channelToEvaluate,
                joinedChannel,
                currentUserCommunityPermissions,
              ]) => {
                // if the user is a member of the parent community, we can return
                if (currentUserCommunityPermissions.isMember) {
                  return Promise.all([channelToEvaluate]);
                } else {
                  // if the user is not a member of the parent community,
                  // join the community and the community's default channels
                  return Promise.all([
                    channelToEvaluate,
                    createMemberInCommunity(
                      channelToEvaluate.communityId,
                      currentUser.id
                    ),
                    createMemberInDefaultChannels(
                      channelToEvaluate.communityId,
                      currentUser.id
                    ),
                  ]);
                }
              })
              // return the channel being evaluated in the first place
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

      // get the channel's permissions for the current user
      const currentUserChannelPermissions = getUserPermissionsInChannel(
        input.channelId,
        currentUser.id
      );

      // get the channel's permissions for the user being toggled
      const evaluatedUserPermissions = getUserPermissionsInChannel(
        input.channelId,
        input.userId
      );

      // get the channel object to be evaluated
      const channels = getChannels([input.channelId]);

      return Promise.all([
        currentUserChannelPermissions,
        evaluatedUserPermissions,
        channels,
      ])
        .then(([channelPermissions, evaluatedUserPermissions, channels]) => {
          // select the channel to be evaluated
          const channelToEvaluate = channels[0];

          // if channel wasn't found or was deleted
          if (!channelToEvaluate || channelToEvaluate.deletedAt) {
            return new UserError("This channel doesn't exist");
          }

          // get the community parent of channel
          const currentUserCommunityPermissions = getUserPermissionsInChannel(
            channelToEvaluate.communityId,
            currentUser.id
          );

          return Promise.all([
            channelToEvaluate,
            currentUserChannelPermissions,
            evaluatedUserPermissions,
            currentUserCommunityPermissions,
          ]);
        })
        .then(([
          channelToEvaluate,
          currentUserChannelPermissions,
          evaluatedUserPermissions,
          currentUserCommunityPermissions,
        ]) => {
          // if the user isn't on the pending list
          if (!evaluatedUserPermissions.isPending) {
            return new UserError(
              'This user is not currently pending access to this channel.'
            );
          }

          // if a user owns the community or owns the channel, they can make this change
          if (
            currentUserChannelPermissions.isOwner ||
            currentUserCommunityPermissions.isOwner
          ) {
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
                  createMemberInCommunity(
                    channelToEvaluate.communityId,
                    currentUser.id
                  ),
                  createMemberInDefaultChannels(
                    channelToEvaluate.communityId,
                    currentUser.id
                  ),
                  approveUser,
                ]).then(() => channelToEvaluate);
              }
            }
          }

          // user is neither a community or channel owner, they don't have permission
          return new UserError(
            "You don't have permission to make changes to this channel."
          );
        });
    },
    unblockUser: (_: any, { input }, { user }: Context) => {
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
        .then(([
          currentUserChannelPermissions,
          evaluatedUserChannelPermissions,
          channels,
        ]) => {
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
        })
        .then(([
          currentUserChannelPermissions,
          evaluatedUserChannelPermissions,
          channelToEvaluate,
          currentUserCommunityPermissions,
        ]) => {
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
            return removeMemberInChannel(input.channelId, input.userId).then(
              () => channelToEvaluate
            );
          }

          // user is neither a community or channel owner, they don't have permission
          return new UserError(
            "You don't have permission to make changes to this channel."
          );
        });
    },
  },
};
