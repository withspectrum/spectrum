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
      {
        first,
        after,
        last,
        before,
      }: { ...PaginationOptions, last: number, before: string },
      { user, loaders }: GraphQLContext
    ) => {
      // Make sure users don't provide bonkers arguments that paginate in both directions at the same time
      if (
        (first && last) ||
        (after && before) ||
        (first && before) ||
        (after && last)
      )
        throw new UserError(
          'Cannot paginate back-and forwards at the same time. Please only ask for the first messages after a certain point or the last messages before a certain point.'
        );

      debug(`get messages for ${id}`);
      const cursor = after || before;
      let timestamp;
      try {
        timestamp = parseInt(decode(cursor), 10);
      } catch (err) {
        debug(err);
        throw new UserError(
          'Invalid cursor passed to "after" parameter of thread.messageConnection.'
        );
      }
      if (!timestamp && user) {
        debug(
          `no valid cursor provided, trying userLastSeen for user ${user.id}`
        );
        try {
          timestamp = await loaders.userThreadNotificationStatus
            .load([user.id, id])
            .then(result => result && result.lastSeen);
        } catch (err) {
          // Ignore errors from getting user last seen
        }
      }
      debug(`cursor: ${timestamp}`);

      let options = {
        // Default first/last to 50 if their counterparts after/before are provided
        // so users can query messageConnection(after: "cursor") or (before: "cursor")
        first: first ? first : after ? 50 : null,
        last: last ? last : before ? 50 : null,
        // Set after/before to the parsed timestamp depending on which one was requested
        // by the user
        after: after ? timestamp : null,
        before: before ? timestamp : null,
      };

      // If we didn't get any arguments at all (i.e messageConnection {})
      // then just fetch the first 50 messages
      // $FlowIssue
      if (Object.keys(options).every(key => !options[key])) {
        options = {
          first: 50,
        };
      }

      debug('pagination options for query:', options);

      // Load one message too much so that we know whether there's
      // a next or previous page
      options.first && options.first++;
      options.last && options.last++;

      return getMessages(id, options).then(result => {
        if (user && user.id) {
          addQueue(TRACK_USER_THREAD_LAST_SEEN, {
            threadId: id,
            userId: user.id,
            timestamp: Date.now(),
          });
        }
        let messages = result;
        // Check if more messages were returned than were requested, which would mean
        // there's a next/previous page. (depending on the direction of the pagination)
        const loadedMoreFirst =
          options.first && result.length > options.first - 1;
        const loadedMoreLast = options.last && result.length > options.last - 1;

        // Get rid of the extranous message if there is one
        if (loadedMoreFirst || loadedMoreLast) {
          debug('not sending extranous message');
          messages = result.slice(0, result.length - 1);
        }

        return {
          pageInfo: {
            // Use the extranous message that was maybe loaded to figure out whether
            // there is a next/previous page, otherwise just try and guess based on
            // if a cursor was provided
            // $FlowIssue
            hasNextPage: loadedMoreFirst || !!options.before,
            // $FlowIssue
            hasPreviousPage: loadedMoreLast || !!options.after,
          },
          edges: messages.map((message, index) => ({
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
          const data = result;
          if (!data || !data.lastSeen) return null;

          return data.lastSeen;
        });
    },
  },
};
