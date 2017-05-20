// @flow
// $FlowFixMe
const { UserError } = require('graphql-errors');
import { getChannels } from '../models/channel';
import { getCommunities } from '../models/community';
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
      if (!currentUser)
        return new UserError('You must be signed in to publish a new thread.');

      return (
        getChannels([thread.channelId])
          // return the channels
          .then(channels => {
            // select the channel the thread is being published in
            const channel = channels[0];

            // if channel wasn't found
            if (!channel) {
              return new UserError("This channel doesn't exist");
            }

            // if user isn't a channel member
            if (!(channel.members.indexOf(currentUser.id) > -1)) {
              return new UserError(
                "You don't have permission to create threads in this channel."
              );
            }

            // all checks passed
            return publishThread(thread, currentUser.id);
          })
      );
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

      // user must be authed to delete a thread
      if (!currentUser)
        return new UserError(
          'You must be signed in to make changes to this thread.'
        );

      // get the thread being delete
      return getThreads([threadId])
        .then(threads => {
          // select the thread
          const thread = threads[0];

          // if the thread doesn't exist
          if (!thread || thread.isDeleted) {
            return new UserError("This thread doesn't exist");
          }

          // get the channel the thread was posted in
          const channels = getChannels([thread.channelId]);
          // get the community the thread was posted in
          const communities = getCommunities([thread.communityId]);

          // return the thread, channels and communities
          return Promise.all([thread, channels, communities]);
        })
        .then(([thread, channels, communities]) => {
          // select the channel and community
          const channel = channels[0];
          const community = communities[0];

          // currentUser owns the community or the channel, they can delete the thread
          if (
            community.owners.indexOf(currentUser.id) > -1 ||
            channel.owners.indexOf(currentUser.id) > -1
          ) {
            return deleteThread(threadId);
          }

          // if the thread creator does not match the currentUser
          if (thread.creatorId !== currentUser.id) {
            return new UserError(
              "You don't have permission to make changes to this thread."
            );
          }

          // all checks passed
          return deleteThread(threadId);
        });
    },
    setThreadLock: (_, { threadId, value }, { user }) => {
      const currentUser = user;

      // user must be authed to edit a thread
      if (!currentUser)
        return new UserError(
          'You must be signed in to make changes to this thread.'
        );

      // get the thread being locked
      return getThreads([threadId])
        .then(threads => {
          // select the thread
          const thread = threads[0];

          // if the thread doesn't exist
          if (!thread) {
            return new UserError("This thread doesn't exist");
          }

          // get the channel the thread was posted in
          const channels = getChannels([thread.channelId]);
          // get the community the thread was posted in
          const communities = getCommunities([thread.communityId]);

          // return the thread, channels and communities
          return Promise.all([thread, channels, communities]);
        })
        .then(([thread, channels, communities]) => {
          // select the channel and community
          const channel = channels[0];
          const community = communities[0];

          // user owns the community or the channel, they can delete the thread
          if (
            community.owners.indexOf(currentUser.id) > -1 ||
            channel.owners.indexOf(currentUser.id) > -1
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
