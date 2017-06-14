//@flow
const { getChannels, getChannelPermissions } = require('../models/channel');
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
import type { PaginationOptions } from '../utils/paginate-arrays';
import type { GraphQLContext } from '../';
import { encode, decode } from '../utils/base64';

module.exports = {
  Query: {
    thread: (_: any, { id }: { id: string }, { loaders }: GraphQLContext) =>
      loaders.thread.load(id),
  },
  Thread: {
    attachments: ({ attachments }) =>
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
    participants: ({ id, creatorId }, _, { loaders }) => {
      return getParticipantsInThread(id);
    },
    isCreator: (
      { creatorId }: { creatorId: String },
      _: any,
      { user }: Context
    ) => {
      if (!creatorId || !user) return false;
      return user.id === creatorId;
    },
    receiveNotifications: ({ id }, __, { user }) => {
      const currentUser = user;
      if (!currentUser) {
        return false;
      } else {
        return getThreadNotificationStatusForUser(
          id,
          currentUser.id
        ).then(threads => {
          return threads.length > 0 ? threads[0].receiveNotifications : false;
        });
      }
    },
    messageConnection: (
      { id }: { id: String },
      { first = 100, after }: PaginationOptions
    ) => {
      const cursor = decode(after);
      return getMessages(id, {
        first,
        after: cursor,
      })
        .then(messages =>
          paginate(
            messages,
            { first, after: cursor },
            message => message.id === cursor
          )
        )
        .then(result => ({
          pageInfo: {
            hasNextPage: result.hasMoreItems,
          },
          edges: result.list.map(message => ({
            cursor: encode(message.id),
            node: message,
          })),
        }));
    },
    creator: (
      { creatorId }: { creatorId: String },
      _: any,
      { loaders }: GraphQLContext
    ) => loaders.user.load(creatorId),
    messageCount: ({ id }: { id: string }) => getMessageCount(id),
  },
};
