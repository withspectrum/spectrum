const { getChannels } = require('../models/channel');
const {
  getCommunities,
  getCommunityPermissions,
} = require('../models/community');
const { getUsers } = require('../models/user');
import {
  getParticipantsInThread,
  getThreadNotificationStatusForUser,
} from '../models/usersThreads';
const { getMessages, getMessageCount } = require('../models/message');
import paginate from '../utils/paginate-arrays';
import { addQueue } from '../utils/workerQueue';
import { TRACK_USER_THREAD_LAST_SEEN } from 'shared/bull/queues';
import type { PaginationOptions } from '../utils/paginate-arrays';
import type { GraphQLContext } from '../';
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
    attachments: ({ attachments }: { attachments: Array<any> }) =>
      attachments &&
      attachments.map(attachment => {
        return {
          attachmentType: attachment.attachmentType,
          data: JSON.stringify(attachment.data),
        };
      }),
    channel: (
      { channelId }: { channelId: string },
      _: any,
      { loaders }: GraphQLContext
    ) => loaders.channel.load(channelId),
    community: (
      { communityId }: { communityId: string },
      _: any,
      { loaders }: GraphQLContext
    ) => loaders.community.load(communityId),
    participants: (
      { id, creatorId }: { id: string, creatorId: string },
      _: any,
      { loaders }: GraphQLContext
    ) => {
      return loaders.threadParticipants
        .load(id)
        .then(result => (result ? result.reduction : []));
    },
    isCreator: (
      { creatorId }: { creatorId: string },
      _: any,
      { user }: GraphQLContext
    ) => {
      if (!creatorId || !user) return false;
      return user.id === creatorId;
    },
    receiveNotifications: (
      { id }: { id: string },
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
    messageConnection: (
      { id, watercooler }: { id: String },
      { first = 999999, after }: PaginationOptions,
      { user }: GraphQLContext
    ) => {
      const cursor = decode(after);
      // Get the index from the encoded cursor, asdf234gsdf-2 => ["-2", "2"]
      const lastDigits = cursor.match(/-(\d+)$/);
      const lastMessageIndex =
        lastDigits && lastDigits.length > 0 && parseInt(lastDigits[1], 10);
      return getMessages(id, {
        // Only send down 200 messages for the watercooler?
        first: watercooler ? 200 : first,
        after: lastMessageIndex,
      }).then(result => {
        if (user && user.id) {
          addQueue(TRACK_USER_THREAD_LAST_SEEN, {
            threadId: id,
            userId: user.id,
            timestamp: Date.now(),
          });
        }
        return {
          pageInfo: {
            hasNextPage: result && result.length >= first,
          },
          edges: result.map((message, index) => ({
            cursor: encode(`${message.id}-${lastMessageIndex + index + 1}`),
            node: message,
          })),
        };
      });
    },
    creator: async (
      { creatorId, communityId }: { creatorId: string, communityId: string },
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
    messageCount: (
      { id }: { id: string },
      __: any,
      { loaders }: GraphQLContext
    ) => {
      return loaders.threadMessageCount
        .load(id)
        .then(messageCount => (messageCount ? messageCount.reduction : 0));
    },
  },
};
