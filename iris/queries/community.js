// @flow
/**
 * Community query resolvers
 */
import UserError from '../utils/UserError';
const {
  getCommunityMetaData,
  getTopCommunities,
  getRecentCommunities,
  getCommunitiesBySearchString,
} = require('../models/community');
const {
  getUserPermissionsInCommunity,
  getMembersInCommunity,
} = require('../models/usersCommunities');
const { getThreadsByChannels } = require('../models/thread');
const {
  getChannelsByCommunity,
  getChannelsByUserAndCommunity,
  getPublicChannelsByCommunity,
} = require('../models/channel');
import { getSlackImport } from '../models/slackImport';
import { getInvoicesByCommunity } from '../models/invoice';
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
    topCommunities: (_: any, { amount = 20 }: { amount: number }) =>
      getTopCommunities(amount),
    recentCommunities: (_: any, { amount = 10 }: { amount: number }) =>
      getRecentCommunities(),
    searchCommunities: (_: any, { string }: { string: string }) =>
      getCommunitiesBySearchString(string),
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
      { id },
      { first = 20, after }: PaginationOptions,
      { loaders }: GraphQLContext
    ) => {
      const cursor = decode(after);

      // TODO: Make this more performant by doing an actual db query rather than this hacking around
      return getMembersInCommunity(id)
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
        channelsToGetThreadsFor = getPublicChannelsByCommunity(id);
      }

      // TODO: Make this more performant by doing an actual db query rather than this hacking around
      return channelsToGetThreadsFor
        .then(channels => channels.map(channel => channel.id))
        .then(channels => getThreadsByChannels(channels))
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
    metaData: ({ id }: { id: string }) => {
      return getCommunityMetaData(id).then(data => {
        return {
          channels: data[0],
          members: data[1],
        };
      });
    },
    slackImport: ({ id }, _, { user }) => {
      const currentUser = user;
      if (!currentUser)
        return new UserError(
          'You must be logged in to view community settings.'
        );
      return getSlackImport(id).then(data => {
        if (!data) return null;
        return {
          teamName: data.teamName,
          members: data.members ? JSON.stringify(data.members) : null,
          sent: data.sent || null,
        };
      });
    },
    invoices: ({ id }, _, { user }) => {
      const currentUser = user;
      if (!currentUser)
        return new UserError(
          'You must be logged in to view community settings.'
        );

      return getInvoicesByCommunity(id);
    },
  },
};
