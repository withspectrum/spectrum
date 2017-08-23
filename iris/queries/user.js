// @flow
const {
  getEverything,
  getUser,
  getUsersBySearchString,
} = require('../models/user');
const { getUsersSettings } = require('../models/usersSettings');
const { getCommunitiesByUser } = require('../models/community');
const { getChannelsByUser } = require('../models/channel');
const {
  getViewableThreadsByUser,
  getPublicThreadsByUser,
} = require('../models/thread');
const { getUserRecurringPayments } = require('../models/recurringPayment');
const {
  getDirectMessageThreadsByUser,
} = require('../models/directMessageThread');
const { getNotificationsByUser } = require('../models/notification');
import paginate from '../utils/paginate-arrays';
import { encode, decode } from '../utils/base64';
import { isAdmin } from '../utils/permissions';
import type { PaginationOptions } from '../utils/paginate-arrays';
import UserError from '../utils/UserError';
import type { GraphQLContext } from '../';
import ImgixClient from 'imgix-core-js';
let imgix = new ImgixClient({
  host: 'spectrum-imgp.imgix.net',
  secureURLToken: 'asGmuMn5yq73B3cH',
});

module.exports = {
  Query: {
    user: (
      _: any,
      args: { id: string, username: string } = {},
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
    coverPhoto: ({ coverPhoto }) => {
      // if the image is not being served from our S3 imgix source, serve it from our web proxy
      if (coverPhoto && coverPhoto.indexOf('spectrum.imgix.net') < 0) {
        return imgix.buildURL(coverPhoto, { w: 640, h: 192 });
      }
      // if the image is being served from the S3 imgix source, return that url
      return coverPhoto;
    },
    profilePhoto: ({ profilePhoto }) => {
      // if the image is not being served from our S3 imgix source, serve it from our web proxy
      if (profilePhoto && profilePhoto.indexOf('spectrum.imgix.net') < 0) {
        return imgix.buildURL(profilePhoto, { w: 128, h: 128 });
      }
      // if the image is being served from the S3 imgix source, return that url
      return profilePhoto;
    },
    isAdmin: ({ id }: { id: string }) => {
      return isAdmin(id);
    },
    isPro: ({ id }: { id: string }, _: any, { loaders }: GraphQLContext) => {
      return loaders.userRecurringPayments
        .load(id)
        .then(
          sub =>
            !(sub == null) &&
            sub.stripeData &&
            sub.stripeData.status === 'active'
              ? true
              : false
        );
    },
    everything: (
      { id }: { id: string },
      { first, after }: PaginationOptions,
      { user }
    ) => {
      const cursor = decode(after);
      // Get the index from the encoded cursor, asdf234gsdf-2 => ["-2", "2"]
      const lastDigits = cursor.match(/-(\d+)$/);
      const lastThreadIndex =
        lastDigits && lastDigits.length > 0 && parseInt(lastDigits[1], 10);
      // TODO: Make this more performant by doingan actual db query rather than this hacking around
      return getEverything(user.id, {
        first,
        after: lastThreadIndex,
      }).then(result => ({
        pageInfo: {
          hasNextPage: result && result.length >= first,
        },
        edges: result
          ? result.map((thread, index) => ({
              cursor: encode(`${thread.id}-${lastThreadIndex + index + 1}`),
              node: thread,
            }))
          : [],
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
      { first, after }: PaginationOptions,
      { user }
    ) => {
      const currentUser = user;
      // if a logged in user is viewing the profile, handle logic to get viewable threads
      const getThreads =
        currentUser && currentUser !== null
          ? getViewableThreadsByUser(id, currentUser.id)
          : // if the viewing user is logged out, only return publicly viewable threads
            getPublicThreadsByUser(id);

      const cursor = decode(after);
      return getThreads
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
    recurringPayments: (_, __, { user }) => {
      if (!user) {
        return new UserError('You must be signed in to continue.');
      }

      return getUserRecurringPayments(user.id).then(subs => {
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
      });
    },
    settings: (_, __, { user }) => {
      if (!user) return new UserError('You must be signed in to continue.');
      return getUsersSettings(user.id);
    },
  },
};
