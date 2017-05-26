//@flow
const { getChannels, getChannelPermissions } = require('../models/channel');
const {
  getCommunities,
  getCommunityPermissions,
} = require('../models/community');
const { getUsers } = require('../models/user');
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
        return Object.assign({}, ...attachment, {
          data: JSON.stringify(attachment.data),
        });
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
      return getMessages(id)
        .then(messages =>
          messages
            .map(
              // create an array of user ids
              message => message.senderId
            )
            .filter(
              // remove the creatorId from the list
              message => message !== creatorId
            )
            .filter(
              (id, index, self) =>
                // get distinct ids in the array
                self.indexOf(id) === index
            )
        )
        .then(users => loaders.user.loadMany(users));
    },
    isCreator: (
      { creatorId }: { creatorId: String },
      _: any,
      { user }: Context
    ) => {
      if (!creatorId || !user) return false;
      return user.id === creatorId;
    },
    channelPermissions: (
      { channelId }: { channelId: String },
      _: any,
      { user }: Context
    ) => {
      if (!channelId || !user) return false;
      return getChannelPermissions(channelId, user.id).then(data => data[0]);
    },
    communityPermissions: (
      { communityId }: { communityId: String },
      _: any,
      { user }: Context
    ) => {
      if (!communityId || !user) return false;
      return getCommunityPermissions(communityId, user.id);
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
