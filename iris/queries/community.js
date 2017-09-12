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
  searchThreadsInCommunity,
} = require('../models/community');
const {
  getUserPermissionsInCommunity,
  getMembersInCommunity,
} = require('../models/usersCommunities');
const { getUserByUsername } = require('../models/user');
const { getThreadsByChannels, getThreads } = require('../models/thread');
const {
  getChannelsByCommunity,
  getChannelsByUserAndCommunity,
  getPublicChannelsByCommunity,
} = require('../models/channel');
import { getSlackImport } from '../models/slackImport';
import { getInvoicesByCommunity } from '../models/invoice';
import { getCommunityRecurringPayments } from '../models/recurringPayment';
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
    searchCommunityThreads: (_, { communityId, searchString }, { user }) => {
      const currentUser = user;

      let channelsToGetThreadsFor;
      if (currentUser) {
        channelsToGetThreadsFor = getChannelsByUserAndCommunity(
          communityId,
          currentUser.id
        );
      } else {
        channelsToGetThreadsFor = getPublicChannelsByCommunity(communityId);
      }

      return channelsToGetThreadsFor
        .then(channels => channels.map(channel => channel.id))
        .then(channels => searchThreadsInCommunity(channels, searchString));
    },
  },
  Community: {
    communityPermissions: (
      { id }: { id: string },
      _: any,
      { user }: GraphQLContext
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
      { id }: { id: string },
      { first = 20, after }: PaginationOptions,
      { loaders }: GraphQLContext
    ) => {
      const cursor = decode(after);

      // TODO: Make this more performant by doing an actual db query rather than this hacking around
      return getMembersInCommunity(id)
        .then(users => loaders.user.loadMany(users))
        .then(users =>
          paginate(
            users,
            { first, after: cursor },
            user => user && user.id === cursor
          )
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
      { id, ...community }: { id: string, community: Object },
      { first = 10, after }: PaginationOptions,
      { user }: GraphQLContext
    ) => {
      const cursor = decode(after);
      const currentUser = user;
      const hasPinnedThread =
        community.pinnedThreadId && community.pinnedThreadId !== null;

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
        .then(threads => {
          const paginatedThreads = paginate(
            threads,
            { first, after: cursor },
            thread => thread.id === cursor
          );

          // if the community has a pinnedThreadId, fetch it
          const getPinnedThread = hasPinnedThread
            ? getThreads([community.pinnedThreadId])
            : null;

          return Promise.all([paginatedThreads, getPinnedThread]);
        })
        .then(([paginatedThreads, pinnedThread]) => {
          // result will be used to return the graphQL pagination data
          let result;

          if (pinnedThread !== null && pinnedThread.length > 0) {
            // if a pinnedThread was found, filter it out of the list of fetched threads
            // to avoid duplication in the feed, and then add the pinned thread to the
            // Front of the array
            let arr = paginatedThreads.list.filter(
              thread => thread.id !== pinnedThread[0].id
            );
            arr.unshift(pinnedThread[0]);
            result = arr;
          } else {
            // if no pinnedThread was found, we can just return the threads list normally
            result = paginatedThreads.list;
          }

          return {
            pageInfo: {
              hasNextPage: paginatedThreads.hasMoreItems,
            },
            edges: result.map(thread => ({
              cursor: encode(thread.id),
              node: thread,
            })),
          };
        });
    },
    metaData: ({ id }: { id: string }) => {
      return getCommunityMetaData(id).then(data => {
        return {
          channels: data[0],
          members: data[1],
        };
      });
    },
    slackImport: ({ id }: { id: string }, _: any, { user }: GraphQLContext) => {
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
    invoices: ({ id }: { id: string }, _: any, { user }: GraphQLContext) => {
      const currentUser = user;
      if (!currentUser)
        return new UserError(
          'You must be logged in to view community settings.'
        );

      return getInvoicesByCommunity(id);
    },
    recurringPayments: (
      { id }: { id: string },
      _: any,
      { user }: GraphQLContext
    ) => {
      const currentUser = user;

      if (!currentUser) {
        return new UserError('You must be signed in to continue.');
      }

      const queryRecurringPayments = async () => {
        const userPermissions = await getUserPermissionsInCommunity(
          id,
          currentUser.id
        );
        if (!userPermissions.isOwner) return;

        const rPayments = await getCommunityRecurringPayments(id);
        const communitySubscriptions =
          rPayments &&
          rPayments.filter(obj => obj.planId === 'community-standard');

        if (!communitySubscriptions || communitySubscriptions.length === 0)
          return;
        return communitySubscriptions.map(subscription => ({
          amount: subscription.amount * subscription.quantity,
          createdAt: subscription.createdAt,
          plan: subscription.planName,
          status: subscription.status,
        }));
      };

      return queryRecurringPayments();
    },
    isPro: ({ id }: { id: string }, _: any, __: any) => {
      return getCommunityRecurringPayments(id).then(subs => {
        let filtered = subs && subs.filter(sub => sub.status === 'active');
        return !filtered || filtered.length === 0 ? false : true;
      });
    },
  },
};
