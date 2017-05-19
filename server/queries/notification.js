// @flow
const { getNotificationsByUser } = require('../models/notification');
const { getMessage } = require('../models/message');
const { getChannels } = require('../models/channel');
import type { GraphQLContext } from '../';

module.exports = {
  Query: {
    notification: (_, { id }, { loaders }: GraphQLContext) =>
      loaders.notification.load(id),
    notifications: (_, { first = 10, after }: PaginationOptions, { user }) =>
      getNotificationsByUser(user.id, { first, after }),
  },
  Notification: {
    isMine: ({ users }, _, { user }) =>
      user && !!users.find(({ id }) => id === user.id),
    read: ({ users }, _, { user }) => {
      if (!user) return null;
      const result = users.find(({ id }) => id === user.id);
      if (!result) return null;
      return result.read;
    },
    message: ({ messageId }) => messageId && getMessage('messages', messageId),
    thread: ({ threadId }, _: any, { loaders }: GraphQLContext) =>
      threadId && loaders.thread.load(threadId),
    channel: ({ channelId }, _: any, { loaders }: GraphQLContext) =>
      channelId && loaders.channel.load(channelId),
    community: ({ communityId }, _: any, { loaders }: GraphQLContext) =>
      communityId && loaders.community.load(communityId),
    sender: ({ senderId }, _, { loaders }: GraphQLContext) =>
      senderId && loaders.user.load(senderId),
  },
};
