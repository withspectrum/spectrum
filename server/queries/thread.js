//@flow
const { getChannels } = require('../models/channel');
const { getCommunities } = require('../models/community');
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
    participants: ({ id, creatorId }: { id: String, creatorId: string }) => {
      return getMessages(id)
        .then(messages =>
          messages
            .map(
              // create an array of user ids
              message => message.sender
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
        .then(users => getUsers(users));
    },
    isCreator: (
      { creatorId }: { creatorId: String },
      _: any,
      { user }: Context
    ) => {
      if (!creatorId || !user) return false;
      return user.id === creatorId;
    },
    isChannelOwner: (
      { channeId }: { channelId: String },
      _: any,
      { user }: Context
    ) => {
      if (!channel || !user) return false;
      return getChannels([channelId]).then(
        data => data[0].owners.indexOf(user.id) > -1
      );
    },
    isCommunityOwner: (
      { communityId }: { communityId: String },
      _: any,
      { user }: Context
    ) => {
      if (!community || !user) return false;
      return getCommunities([communityId]).then(
        data => data[0].owners.indexOf(user.id) > -1
      );
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
    messageCount: ({ id }: { id: string }) => getMessageCount('messages', id),
  },
};
