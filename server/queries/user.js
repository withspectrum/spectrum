// @flow
const {
  getEverything,
  getUser,
  getUsersBySearchString,
} = require('../models/user');
const { getCommunitiesByUser } = require('../models/community');
const { getChannelsByUser } = require('../models/channel');
const { getThreadsByUser } = require('../models/thread');
const { getUserSubscriptions } = require('../models/subscription');
const {
  getDirectMessageThreadsByUser,
} = require('../models/directMessageThread');
const { getNotificationsByUser } = require('../models/notification');
import paginate from '../utils/paginate-arrays';
import { encode, decode } from '../utils/base64';
import { isAdmin } from '../utils/permissions';
import type { PaginationOptions } from '../utils/paginate-arrays';
import type { GraphQLContext } from '../';

module.exports = {
  Query: {
    user: (
      _: any,
      args: { id: string, username: string },
      { loaders }: GraphQLContext
    ) => {
      if (args.id) return loaders.user.load(args.id);
      if (args.username) return getUser({ username: args.username });
      return null;
    },
    currentUser: (_: any, __: any, { user }: GraphQLContext) => user,
    searchUsers: (_: any, { string }: { string: string }) =>
      getUsersBySearchString(string),
  },
  User: {
    notificationConnection: (
      { id }: { id: string },
      { first = 10, after }: PaginationOptions,
      { user }: GraphQLContext
    ) => {
      const currentUser = user;
      if (!currentUser || currentUser.id !== id) return null;
      return getNotificationsByUser(id, { first, after });
    },
    isAdmin: ({ id }: { id: string }) => {
      return isAdmin(id);
    },
    isPro: ({ id }: { id: string }) => {
      return getUserSubscriptions(id).then(
        sub =>
          (sub !== null &&
            sub[0].stripeData &&
            sub[0].stripeData.status === 'active'
            ? true
            : false)
      );
    },
    everything: (
      { id }: { id: string },
      { first = 10, after }: PaginationOptions
    ) => {
      const cursor = decode(after);
      // TODO: Make this more performant by doing an actual db query rather than this hacking around
      return getEverything(id)
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
    communityConnection: (user: Object) => ({
      // Don't paginate communities and channels of a user
      pageInfo: {
        hasNextPage: false,
      },
      edges: getCommunitiesByUser(user.id).then(communities =>
        communities.map(community => ({
          node: {
            ...community,
          },
        }))
      ),
    }),
    channelConnection: (user: Object) => ({
      pageInfo: {
        hasNextPage: false,
      },
      edges: getChannelsByUser(user.id).then(channels =>
        channels.map(channel => ({
          node: channel,
        }))
      ),
    }),
    directMessageThreadsConnection: ({ id }) => ({
      pageInfo: {
        hasNextPage: false,
      },
      edges: getDirectMessageThreadsByUser(id).then(threads =>
        threads.map(thread => ({
          node: thread,
        }))
      ),
    }),
    threadConnection: (
      { id }: { id: string },
      { first = 10, after }: PaginationOptions
    ) => {
      const cursor = decode(after);
      return getThreadsByUser(id, { first, after: cursor })
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
    threadCount: (
      { id }: { id: string },
      _: any,
      { loaders }: GraphQLContext
    ) => {
      return loaders.userThreadCount.load(id).then(data => data.count);
    },
    subscriptions: (_, __, { user }) =>
      getUserSubscriptions(user.id).then(subs => {
        if (!subs || subs.length === 0) {
          return [];
        } else {
          return subs.map(sub => {
            return {
              amount: subs[0].stripeData.plan.amount,
              created: subs[0].stripeData.created,
              plan: subs[0].stripeData.plan.name,
              status: subs[0].stripeData.status,
            };
          });
        }
      }),
  },
};
