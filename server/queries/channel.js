// @flow
const {
  getChannelBySlug,
  getChannelMetaData,
  getChannelMemberCount,
  getTopChannels,
  getChannelPermissions,
  getPendingChannelUsers,
  getBlockedChannelUsers,
  getChannelModerators,
  getChannelOwners,
} = require('../models/channel');
const { getCommunityPermissions } = require('../models/community');
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
      if (args.channelSlug && args.communitySlug)
        return getChannelBySlug(args.channelSlug, args.communitySlug);
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
    community: (
      { communityId }: { communityId: string },
      _: any,
      { loaders }: GraphQLContext
    ) => loaders.community.load(communityId),
    channelPermissions: (args, _: any, { user }: Context) => {
      const channelId = args.id || args.channelId;
      if (!channelId || !user) return false;
      return getChannelPermissions(channelId, user.id);
    },
    communityPermissions: (args, _: any, { user }: Context) => {
      const communityId = args.id || args.communityId;
      if (!communityId || !user) return false;
      return getCommunityPermissions(communityId, user.id);
    },
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
    pendingUsers: ({ id }: { id: string }, _, { loaders }) => {
      return getPendingChannelUsers(id).then(users =>
        loaders.user.loadMany(users)
      );
    },
    blockedUsers: ({ id }: { id: string }, _, { loaders }) => {
      return getBlockedChannelUsers(id).then(users =>
        loaders.user.loadMany(users)
      );
    },
    moderators: ({ id }: { id: string }, _, { loaders }) => {
      return getChannelModerators(id).then(users =>
        loaders.user.loadMany(users)
      );
    },
    owners: ({ id }: { id: string }, _, { loaders }) => {
      return getChannelOwners(id).then(users => loaders.user.loadMany(users));
    },
  },
};
