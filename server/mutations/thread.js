// @flow
// $FlowFixMe
const { UserError } = require('graphql-errors');
import { getChannels } from '../models/channel';
import { getCommunities } from '../models/community';
import { getUserPermissionsInChannel } from '../models/usersChannels';
import { getUserPermissionsInCommunity } from '../models/usersCommunities';
const {
  getThreads,
  publishThread,
  deleteThread,
  setThreadLock,
  editThread,
} = require('../models/thread');

module.exports = {
  Mutation: {
    publishThread: (_, { thread }, { user }) => {
      const currentUser = user;

      // user must be authed to publish a thread
      if (!currentUser) {
        return new UserError('You must be signed in to publish a new thread.');
      }

      const currentUserChannelPermissions = getUserPermissionsInChannel(
        thread.channelId,
        currentUser.id
      );
      const channels = getChannels([thread.channelId]);

      return Promise.all([currentUserChannelPermissions, channels]).then(([
        currentUserChannelPermissions,
        channels,
      ]) => {
        console.log(currentUserChannelPermissions);
        console.log(channels);
        // select the channel to evaluate
        const channelToEvaluate = channels[0];

        // if channel wasn't found
        if (!channelToEvaluate || channelToEvaluate.deletedAt) {
          return new UserError("This channel doesn't exist");
        }

        // if user isn't a channel member
        if (!currentUserChannelPermissions.isMember) {
          return new UserError(
            "You don't have permission to create threads in this channel."
          );
        }

        return publishThread(thread, currentUser.id);
      });
    },
    editThread: (_, { threadId, newContent }, { user }) => {
      const currentUser = user;

      // user must be authed to edit a thread
      if (!currentUser)
        return new UserError(
          'You must be signed in to make changes to this thread.'
        );
      return getThreads([threadId]).then(threads => {
        // select the thread
        const thread = threads[0];

        // if the thread doesn't exist
        if (!thread) {
          return new UserError("This thread doesn't exist");
        }

        // only the thread creator can edit the thread
        if (thread.creatorId !== currentUser.id) {
          return new UserError(
            "You don't have permission to make changes to this thread."
          );
        }

        // all checks passed
        return editThread(threadId, newContent);
      });
    },
    deleteThread: (_, { threadId }, { user }) => {
      const currentUser = user;

      // user must be authed to edit a thread
      if (!currentUser) {
        return new UserError(
          'You must be signed in to make changes to this thread.'
        );
      }

      // get the thread being locked
      return getThreads([threadId])
        .then(threads => {
          // select the thread
          const threadToEvaluate = threads[0];

          // if the thread doesn't exist
          if (!threadToEvaluate || threadToEvaluate.deletedAt) {
            return new UserError("This thread doesn't exist");
          }

          // get the channel permissions
          const currentUserChannelPermissions = getUserPermissionsInChannel(
            threadToEvaluate.channelId,
            currentUser.id
          );
          // get the community permissions
          const currentUserCommunityPermissions = getUserPermissionsInCommunity(
            threadToEvaluate.communityId,
            currentUser.id
          );

          // return the thread, channels and communities
          return Promise.all([
            threadToEvaluate,
            currentUserChannelPermissions,
            currentUserCommunityPermissions,
          ]);
        })
        .then(([
          thread,
          currentUserChannelPermissions,
          currentUserCommunityPermissions,
        ]) => {
          // user owns the community or the channel, they can lock the thread
          if (
            currentUserChannelPermissions.isOwner ||
            currentUserChannelPermissions.isModerator ||
            currentUserCommunityPermissions.isOwner ||
            currentUserCommunityPermissions.isModerator ||
            thread.creatorId === currentUser.id
          ) {
            return deleteThread(threadId);
          }

          // if the user is not a channel or community owner, the thread can't be locked
          return new UserError(
            "You don't have permission to make changes to this thread."
          );
        });
    },
    setThreadLock: (_, { threadId, value }, { user }) => {
      const currentUser = user;

      // user must be authed to edit a thread
      if (!currentUser) {
        return new UserError(
          'You must be signed in to make changes to this thread.'
        );
      }

      // get the thread being locked
      return getThreads([threadId])
        .then(threads => {
          // select the thread
          const threadToEvaluate = threads[0];

          // if the thread doesn't exist
          if (!threadToEvaluate || threadToEvaluate.deletedAt) {
            return new UserError("This thread doesn't exist");
          }

          // get the channel permissions
          const currentUserChannelPermissions = getUserPermissionsInChannel(
            threadToEvaluate.channelId,
            currentUser.id
          );
          // get the community permissions
          const currentUserCommunityPermissions = getUserPermissionsInCommunity(
            threadToEvaluate.communityId,
            currentUser.id
          );

          // return the thread, channels and communities
          return Promise.all([
            threadToEvaluate,
            currentUserChannelPermissions,
            currentUserCommunityPermissions,
          ]);
        })
        .then(([
          thread,
          currentUserChannelPermissions,
          currentUserCommunityPermissions,
        ]) => {
          // user owns the community or the channel, they can lock the thread
          if (
            currentUserChannelPermissions.isOwner ||
            currentUserChannelPermissions.isModerator ||
            currentUserCommunityPermissions.isOwner ||
            currentUserCommunityPermissions.isModerator
          ) {
            return setThreadLock(threadId, value);
          }

          // if the user is not a channel or community owner, the thread can't be locked
          return new UserError(
            "You don't have permission to make changes to this thread."
          );
        });
    },
  },
};
