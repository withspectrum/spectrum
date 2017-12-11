// @flow
const debug = require('debug')('iris:queries:thread');
const { getChannels } = require('../models/channel');
const { getCommunities } = require('../models/community');
const { getUsers } = require('../models/user');
import {
  getParticipantsInThread,
  getThreadNotificationStatusForUser,
} from '../models/usersThreads';
const { getMessages, getMessageCount } = require('../models/message');
import paginate from '../utils/paginate-arrays';
import { addQueue } from '../utils/workerQueue';
import { TRACK_USER_THREAD_LAST_SEEN } from 'shared/bull/queues';
import UserError from '../utils/UserError';
import type { PaginationOptions } from '../utils/paginate-arrays';
import type { GraphQLContext } from '../';
import type { DBThread } from 'shared/types';
import { encode, decode } from '../utils/base64';

module.exports = {
  Query: {
    thread: (
      _: any,
      { id }: { id: string },
      { loaders, user }: GraphQLContext
    ) =>
      loaders.thread.load(id).then(thread => {
        // if a thread wasn't found
        if (!thread) return null;

        /*
          If no user exists, we need to make sure the thread being fetched is not in a private channel
        */
        if (!user) {
          return Promise.all([
            thread,
            loaders.channel.load(thread.channelId),
          ]).then(([thread, channel]) => {
            // if the channel is private, don't return any thread data
            if (channel.isPrivate) return null;
            return thread;
          });
        } else {
          // if the user is signed in, we need to check if the channel is private as well as the user's permission in that channel
          return Promise.all([
            thread,
            loaders.userPermissionsInChannel.load([user.id, thread.channelId]),
            loaders.channel.load(thread.channelId),
          ]).then(([thread, permissions, channel]) => {
            // if the thread is in a private channel where the user is not a member, don't return any thread data
            if (channel.isPrivate && !permissions.isMember) return null;
            return thread;
          });
        }
      }),
  },
  Thread: {
    attachments: ({ attachments }: DBThread) =>
      attachments &&
      attachments.map(attachment => {
        return {
          attachmentType: attachment.attachmentType,
          data: JSON.stringify(attachment.data),
        };
      }),
    channel: ({ channelId }: DBThread, _: any, { loaders }: GraphQLContext) =>
      loaders.channel.load(channelId),
    community: (
      { communityId }: DBThread,
      _: any,
      { loaders }: GraphQLContext
    ) => loaders.community.load(communityId),
    participants: (
      { id, creatorId }: DBThread,
      _: any,
      { loaders }: GraphQLContext
    ) => {
      return loaders.threadParticipants
        .load(id)
        .then(result => (result ? result.reduction : []));
    },
    isCreator: ({ creatorId }: DBThread, _: any, { user }: GraphQLContext) => {
      if (!creatorId || !user) return false;
      return user.id === creatorId;
    },
    receiveNotifications: (
      { id }: DBThread,
      __: any,
      { user, loaders }: GraphQLContext
    ) => {
      const currentUser = user;
      if (!currentUser) {
        return false;
      } else {
        return loaders.userThreadNotificationStatus
          .load([currentUser.id, id])
          .then(result => (result ? result.receiveNotifications : false));
      }
    },
    messageConnection: async (
      { id }: DBThread,
      { first = 50, after }: PaginationOptions,
      { user, loaders }: GraphQLContext
    ) => {
      debug(`get messages for ${id}`);
      let cursor;
      try {
        cursor = parseInt(decode(after), 10);
      } catch (err) {
        debug(err);
        throw new UserError(
          'Invalid cursor passed to "after" parameter of thread.messageConnection.'
        );
      }
      if (!cursor && user) {
        debug(
          `no valid cursor provided, getting user last seen for user ${user.id}`
        );
        try {
          cursor = await loaders.userThreadNotificationStatus
            .load([user.id, id])
            .then(result => result && result.lastSeen);
        } catch (err) {
          // Ignore errors from getting user last seen
        }
      }
      debug(`cursor: ${cursor}`);
      const messageCount = await loaders.threadMessageCount
        .load(id)
        .then(res => (res ? res.reduction : 0));

      return getMessages(id, { first, after: cursor }).then(result => {
        if (user && user.id) {
          addQueue(TRACK_USER_THREAD_LAST_SEEN, {
            threadId: id,
            userId: user.id,
            timestamp: Date.now(),
          });
        }
        return {
          pageInfo: {
            // TODO(@mxstbr): Figure out how we know this
            hasNextPage:
              messageCount !== 0 && result && result.length <= messageCount,
            hasPreviousPage: false,
          },
          edges: result.map((message, index) => ({
            cursor: encode(message.timestamp.getTime().toString()),
            node: message,
          })),
        };
      });
    },
    creator: async (
      { creatorId, communityId }: DBThread,
      _: any,
      { loaders }: GraphQLContext
    ) => {
      const creator = await loaders.user.load(creatorId);

      const permissions = await loaders.userPermissionsInCommunity.load([
        creatorId,
        communityId,
      ]);

      return {
        ...creator,
        contextPermissions: {
          communityId,
          reputation: permissions ? permissions.reputation : 0,
          isModerator: permissions ? permissions.isModerator : false,
          isOwner: permissions ? permissions.isOwner : false,
        },
      };
    },
    messageCount: ({ id }: DBThread, __: any, { loaders }: GraphQLContext) => {
      return loaders.threadMessageCount
        .load(id)
        .then(messageCount => (messageCount ? messageCount.reduction : 0));
    },
    currentUserLastSeen: (
      { id }: DBThread,
      _: any,
      { user, loaders }: GraphQLContext
    ) => {
      if (!user || !user.id) return null;

      return loaders.userThreadNotificationStatus
        .load([user.id, id])
        .then(result => {
          if (!result || result.length === 0) return;
          const data = result[0];
          if (!data || !data.lastSeen) return null;

          return data.lastSeen;
        });
    },
  },
};
