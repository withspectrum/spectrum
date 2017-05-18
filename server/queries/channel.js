// @flow
const {
  getChannelBySlug,
  getChannelMetaData,
  getChannelMemberCount,
  getTopChannels,
} = require('../models/channel');
const { getThreadsByChannel } = require('../models/thread');
import paginate from '../utils/paginate-arrays';
import { encode, decode } from '../utils/base64';
import type { PaginationOptions } from '../utils/paginate-arrays';
import type { GetChannelArgs } from '../models/channel';
import type { GraphQLContext } from '../';

module.exports = {
  Query: {
    channel: (_: any, args: GetChannelArgs, { loaders }: GraphQLContext) => {
      if (args.id) return loaders.channel.load(args.id);
      if (args.slug && args.communitySlug)
        return getChannelBySlug(args.slug, args.communitySlug);
      return null;
    },
    topChannels: (_: any, { amount = 30 }: { amount: number }) =>
      getTopChannels(amount),
  },
  Channel: {
    memberCount: ({ id }: { id: string }) => getChannelMemberCount(id),
    threadConnection: (
      { id }: { id: string },
      { first = 10, after }: PaginationOptions
    ) => {
      const cursor = decode(after);
      return getThreadsByChannel(id, { first, after: cursor })
        .then(threads =>
          paginate(
            threads,
            { first, after: cursor },
            thread => thread.id === cursor
          )
        )
        .then(result => ({
          pageInfo: {
            hasNextPage: result.hasMoreItems,
          },
          edges: result.list.map(thread => ({
            cursor: encode(thread.id),
            node: thread,
          })),
        }));
    },
    blockedUsers: ({ blockedUsers }, _, { loaders }: GraphQLContext) => {
      return loaders.user.loadMany(blockedUsers).then(users => users);
    },
    pendingUsers: ({ pendingUsers }, _, { loaders }: GraphQLContext) => {
      return loaders.user.loadMany(pendingUsers).then(users => users);
    },
    isOwner: ({ owners }, _, { user }) => {
      if (!user) return false;
      return owners.indexOf(user.id) > -1;
    },
    isMember: ({ members }, _, { user }) => {
      if (!user) return false;
      return members.indexOf(user.id) > -1;
    },
    isPending: ({ pendingUsers }, _, { user }) => {
      if (!user) return false;
      return pendingUsers.indexOf(user.id) > -1;
    },
    isBlocked: ({ blockedUsers }, _, { user }) => {
      if (!user) return false;
      return blockedUsers.indexOf(user.id) > -1;
    },
    community: (
      { communityId }: { communityId: string },
      _: any,
      { loaders }: GraphQLContext
    ) => loaders.community.load(communityId),
    memberConnection: (
      { members }: { members: Array<string> },
      { first = 10, after }: PaginationOptions,
      { loaders }: GraphQLContext
    ) => {
      const { list, hasMoreItems } = paginate(members, {
        first,
        after: decode(after),
      });
      return loaders.user.loadMany(list).then(users => ({
        pageInfo: {
          hasNextPage: hasMoreItems,
        },
        edges: users.map(user => ({
          cursor: encode(user.id),
          node: user,
        })),
      }));
    },
    metaData: ({ id }: { id: string }) => {
      return getChannelMetaData(id).then(data => {
        return {
          threads: data[0],
          members: data[1],
        };
      });
    },
  },
};
