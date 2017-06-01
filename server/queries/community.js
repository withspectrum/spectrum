// @flow
/**
 * Community query resolvers
 */
const {
  getCommunityMetaData,
  getTopCommunities,
} = require('../models/community');
const { getUserPermissionsInCommunity } = require('../models/usersCommunities');
const { getThreadsByChannels } = require('../models/thread');
const {
  getChannelsByCommunity,
  getChannelsByUserAndCommunity,
  getPublicChannelsByCommunity,
} = require('../models/channel');
import paginate from '../utils/paginate-arrays';
import type { PaginationOptions } from '../utils/paginate-arrays';
import type { GetCommunityArgs } from '../models/community';
import { encode, decode } from '../utils/base64';
import type { GraphQLContext } from '../';

module.exports = {
  Query: {
    community: (
      _: any,
      args: GetCommunityArgs,
      { loaders, user }: GraphQLContext
    ) => {
      if (args.id) return loaders.community.load(args.id);
      if (args.slug) return loaders.communityBySlug.load(args.slug);

      return null;
    },
    topCommunities: (_: any, { amount = 30 }: { amount: number }) =>
      getTopCommunities(amount),
  },
  Community: {
    communityPermissions: (
      { id }: { id: String },
      _: any,
      { user }: Context
    ) => {
      if (!id || !user) return false;
      return getUserPermissionsInCommunity(id, user.id);
    },
    channelConnection: ({ id }: { id: string }) => ({
      pageInfo: {
        hasNextPage: false,
      },
      edges: getChannelsByCommunity(id).then(channels =>
        channels.map(channel => ({
          node: channel,
        }))
      ),
    }),
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
    threadConnection: (
      { id }: { id: string },
      { first = 10, after }: PaginationOptions,
      { user }
    ) => {
      const cursor = decode(after);
      const currentUser = user;

      // if the user is signed in, only return stories for the channels
      // the user is a member of -> this will ensure that they don't see
      // stories in private channels that they aren't a member of.
      // if the user is *not* signed in, only get threads from public channels
      // within the community
      let channelsToGetThreadsFor;
      if (user) {
        channelsToGetThreadsFor = getChannelsByUserAndCommunity(
          id,
          currentUser.id
        );
      } else {
        console.log('getting public channel threads');
        channelsToGetThreadsFor = getPublicChannelsByCommunity(id);
      }

      // TODO: Make this more performant by doing an actual db query rather than this hacking around
      return channelsToGetThreadsFor
        .then(
          channels =>
            console.log('got channels', channels) ||
            channels.map(channel => channel.id)
        )
        .then(channels => getThreadsByChannels(channels))
        .then(
          threads =>
            console.log('got threads', threads) ||
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
    metaData: ({ id }: { id: string }) => {
      return getCommunityMetaData(id).then(data => {
        return {
          channels: data[0],
          members: data[1],
        };
      });
    },
  },
};
