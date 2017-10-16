// @flow
// $FlowFixMe
import ImgixClient from 'imgix-core-js';
const {
  getEverything,
  getUser,
  getUsersBySearchString,
} = require('../models/user');
const { getUsersSettings } = require('../models/usersSettings');
const {
  getCommunitiesByUser,
  getCommunitiesBySlug,
} = require('../models/community');
const { getChannelsByUser } = require('../models/channel');
const {
  getThread,
  getViewableThreadsByUser,
  getPublicThreadsByUser,
} = require('../models/thread');
const { getUserRecurringPayments } = require('../models/recurringPayment');
const {
  getDirectMessageThreadsByUser,
} = require('../models/directMessageThread');
const { getNotificationsByUser } = require('../models/notification');
import { getInvoicesByUser } from '../models/invoice';
import paginate from '../utils/paginate-arrays';
import { encode, decode } from '../utils/base64';
import { isAdmin } from '../utils/permissions';
import type { PaginationOptions } from '../utils/paginate-arrays';
import UserError from '../utils/UserError';
import type { GraphQLContext } from '../';
import type { DBUser } from '../models/user';
import { getReputationByUser } from '../models/usersCommunities';
let imgix = new ImgixClient({
  host: 'spectrum-imgp.imgix.net',
  secureURLToken: 'asGmuMn5yq73B3cH',
});

module.exports = {
  Query: {
    user: (
      _: any,
      args: { id?: string, username?: string } = {},
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
    coverPhoto: ({ coverPhoto }: DBUser) => {
      // if the image is not being served from our S3 imgix source, serve it from our web proxy
      if (coverPhoto && coverPhoto.indexOf('spectrum.imgix.net') < 0) {
        return imgix.buildURL(coverPhoto, { w: 640, h: 192 });
      }
      // if the image is being served from the S3 imgix source, return that url
      return coverPhoto;
    },
    profilePhoto: ({ profilePhoto }: DBUser) => {
      // if the image is not being served from our S3 imgix source, serve it from our web proxy
      if (profilePhoto && profilePhoto.indexOf('spectrum.imgix.net') < 0) {
        return imgix.buildURL(profilePhoto, { w: 128, h: 128 });
      }
      // if the image is being served from the S3 imgix source, return that url
      return profilePhoto;
    },
    isAdmin: ({ id }: DBUser) => {
      return isAdmin(id);
    },
    isPro: ({ id }: DBUser, _: any, { loaders }: GraphQLContext) => {
      return loaders.userRecurringPayments
        .load(id)
        .then(
          sub => (!(sub == null) && sub.status === 'active' ? true : false)
        );
    },
    everything: (
      { id }: DBUser,
      { first, after }: PaginationOptions,
      { user }: GraphQLContext
    ) => {
      const cursor = decode(after);
      // Get the index from the encoded cursor, asdf234gsdf-2 => ["-2", "2"]
      const lastDigits = cursor.match(/-(\d+)$/);
      const lastThreadIndex =
        lastDigits && lastDigits.length > 0 && parseInt(lastDigits[1], 10);
      // TODO: Make this more performant by doingan actual db query rather than this hacking around
      // $FlowFixMe
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
    communityConnection: (user: DBUser) => ({
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
    channelConnection: (user: DBUser) => ({
      pageInfo: {
        hasNextPage: false,
      },
      edges: getChannelsByUser(user.id).then(channels =>
        channels.map(channel => ({
          node: channel,
        }))
      ),
    }),
    directMessageThreadsConnection: ({ id }: DBUser) => ({
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
      { user }: GraphQLContext
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
    recurringPayments: (
      { id }: DBUser,
      __: any,
      { user, loaders }: GraphQLContext
    ) => {
      if (!user) {
        return new UserError('You must be signed in to continue.');
      }
      if (id !== user.id) {
        throw new UserError('You can only see your own recurring payments.');
      }

      return loaders.userRecurringPayments.load(user.id).then(subs => {
        const userProSubs =
          subs &&
          subs.length > 0 &&
          subs.filter(obj => obj.planId === 'beta-pro');
        if (!userProSubs || userProSubs.length === 0) {
          return [];
        } else {
          return userProSubs.map(subscription => {
            return {
              amount: subscription.amount,
              createdAt: subscription.createdAt,
              plan: subscription.planName,
              status: subscription.status,
            };
          });
        }
      });
    },
    settings: (_: DBUser, __: any, { user }: GraphQLContext) => {
      if (!user) return new UserError('You must be signed in to continue.');
      return getUsersSettings(user.id);
    },
    invoices: ({ id }: DBUser, _: any, { user }: GraphQLContext) => {
      const currentUser = user;
      if (!currentUser)
        return new UserError('You must be logged in to view these settings.');

      return getInvoicesByUser(currentUser.id);
    },
    totalReputation: async ({ id }: DBUser, _: any, __: any) => {
      if (!id) return 0;
      return getReputationByUser(id);
    },
    contextPermissions: (
      user: any,
      _: any,
      { loaders }: GraphQLContext,
      info: any
    ) => {
      // in some cases we fetch this upstream - e.g. in the case of querying for usersThreads, we need to fetch contextPermissions before we hit this step as threadIds are not included in the query variables
      if (user.contextPermissions) return user.contextPermissions;

      const queryName = info.operation.name.value;

      const handleCheck = async () => {
        switch (queryName) {
          case 'getThread':
          case 'getThreadMessages': {
            const threadId = info.variableValues.id;
            const { communityId } = await getThread(threadId);
            const {
              reputation,
              isModerator,
              isOwner,
            } = await loaders.userPermissionsInCommunity.load([
              user.id,
              communityId,
            ]);
            return {
              reputation,
              isModerator,
              isOwner,
            };
          }
          case 'loadMoreCommunityMembers':
          case 'getCommunityMembers': {
            const communityId = info.variableValues.id;
            const {
              reputation,
              isModerator,
              isOwner,
            } = await loaders.userPermissionsInCommunity.load([
              user.id,
              communityId,
            ]);
            return {
              reputation,
              isModerator,
              isOwner,
            };
          }
          case 'getCommunityTopMembers': {
            const communities = await getCommunitiesBySlug([
              info.variableValues.slug,
            ]);
            const { id } = communities[0];
            const {
              reputation,
              isModerator,
              isOwner,
            } = await loaders.userPermissionsInCommunity.load([user.id, id]);
            return {
              reputation: reputation || 0,
              isModerator,
              isOwner,
            };
          }
        }
      };

      return handleCheck();
    },
  },
};
