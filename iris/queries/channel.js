const {
  getChannelBySlug,
  getChannelMetaData,
  getChannelMemberCount,
} = require('../models/channel');
const {
  getUserPermissionsInChannel,
  getPendingUsersInChannel,
  getBlockedUsersInChannel,
  getModeratorsInChannel,
  getMembersInChannel,
  getOwnersInChannel,
} = require('../models/usersChannels');
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
  },
  Channel: {
    memberCount: ({ id }: { id: string }) => getChannelMemberCount(id),
    threadConnection: (
      { id }: { id: string },
      { first, after }: PaginationOptions
    ) => {
      return getThreadsByChannel(id, {
        first,
        after: after && parseInt(decode(after), 10),
      }).then(threads => ({
        pageInfo: {
          hasNextPage: threads.length >= first,
        },
        edges: threads.map(thread => ({
          cursor: encode(String(thread.lastActive.getTime())),
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
      return getUserPermissionsInChannel(channelId, user.id);
    },
    communityPermissions: (args, _: any, { user, loaders }: Context) => {
      const communityId = args.id || args.communityId;
      if (!communityId || !user) return false;
      return loaders.userPermissionsInCommunity.load([user.id, communityId]);
    },
    memberConnection: (
      { id },
      { first, after }: PaginationOptions,
      { loaders }: GraphQLContext
    ) => {
      const cursor = decode(after);

      // TODO: Make this more performant by doing an actual db query rather than this hacking around
      return getMembersInChannel(id)
        .then(users => loaders.user.loadMany(users))
        .then(users =>
          paginate(users, { first, after: cursor }, user => user.id === cursor)
        )
        .then(result => ({
          pageInfo: {
            hasNextPage: result.hasMoreItems,
          },
          edges: result.list.map(user => ({
            cursor: encode(user.id),
            node: user,
          })),
        }));
    },
    metaData: ({ id }: { id: string }, _: any, { loaders }: GraphQLContext) => {
      return Promise.all([
        loaders.channelThreadCount.load(id),
        loaders.channelMemberCount.load(id),
      ]).then(([threadCount, memberCount]) => ({
        threads: threadCount.reduction,
        members: memberCount.reduction,
      }));
    },
    pendingUsers: ({ id }: { id: string }, _, { loaders }) => {
      return getPendingUsersInChannel(id).then(users =>
        loaders.user.loadMany(users)
      );
    },
    blockedUsers: ({ id }: { id: string }, _, { loaders }) => {
      return getBlockedUsersInChannel(id).then(users =>
        loaders.user.loadMany(users)
      );
    },
    moderators: ({ id }: { id: string }, _, { loaders }) => {
      return getModeratorsInChannel(id).then(users =>
        loaders.user.loadMany(users)
      );
    },
    owners: ({ id }: { id: string }, _, { loaders }) => {
      return getOwnersInChannel(id).then(users => loaders.user.loadMany(users));
    },
  },
};
