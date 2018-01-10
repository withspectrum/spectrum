// @flow
// $FlowFixMe
import ImgixClient from 'imgix-core-js';
const { getEverything } = require('../models/user');
const { getUsersSettings } = require('../models/usersSettings');
const {
  getCommunitiesByUser,
  getCommunitiesBySlug,
} = require('../models/community');
const { getChannelById, getChannelsByUser } = require('../models/channel');
const {
  getThread,
  getViewableThreadsByUser,
  getPublicThreadsByUser,
  getPublicParticipantThreadsByUser,
  getViewableParticipantThreadsByUser,
} = require('../models/thread');
const {
  getDirectMessageThreadsByUser,
} = require('../models/directMessageThread');
import { getInvoicesByUser } from '../models/invoice';
import { isAdmin } from '../utils/permissions';
import { encode, decode } from '../utils/base64';
import type { PaginationOptions } from '../utils/paginate-arrays';
import UserError from '../utils/UserError';
import type { GraphQLContext } from '../';
import type { DBUser } from '../models/user';
import initIndex from 'shared/algolia';
const usersSearchIndex = initIndex('users');
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
      if (args.username) return loaders.userByUsername.load(args.username);
      return null;
    },
    currentUser: (_: any, __: any, { user }: GraphQLContext) => user,
    searchUsers: (
      _: any,
      { string }: { string: string },
      { loaders }: GraphQLContext
    ) => {
      return usersSearchIndex
        .search({ query: string })
        .then(content => {
          if (!content.hits || content.hits.length === 0) return [];
          const userIds = content.hits.map(o => o.objectID);
          return loaders.user.loadMany(userIds);
        })
        .catch(err => {
          console.log('err', err);
        });
    },
  },
  User: {
    email: ({ id, email }: DBUser, _: any, { user }: GraphQLContext) => {
      // Only admins and the user themselves can view the email
      if (!user || (id !== user.id && !isAdmin(user.id))) return null;
      return email;
    },
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
    isPro: ({ id }: DBUser, _: any, { loaders }: GraphQLContext) => {
      return loaders.userRecurringPayments.load(id).then(result => {
        if (!result || result.length === 0) return false;
        const subs = result.reduction;

        return subs.some(
          sub => sub.status === 'active' && sub.planId === 'beta-pro'
        );
      });
    },
    everything: (
      _: any,
      { first, after }: PaginationOptions,
      { user }: GraphQLContext
    ) => {
      const cursor = decode(after);
      // Get the index from the encoded cursor, asdf234gsdf-2 => ["-2", "2"]
      const lastDigits = cursor.match(/-(\d+)$/);
      const lastThreadIndex =
        lastDigits && lastDigits.length > 0 && parseInt(lastDigits[1], 10);
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
    directMessageThreadsConnection: async (
      _: any,
      { first = 15, after }: PaginationOptions,
      { user }: GraphQLContext
    ) => {
      const cursor = decode(after);
      // Get the index from the encoded cursor, asdf234gsdf-2 => ["-2", "2"]
      const lastDigits = cursor.match(/-(\d+)$/);
      const lastThreadIndex =
        lastDigits && lastDigits.length > 0 && parseInt(lastDigits[1], 10);

      const threads = await getDirectMessageThreadsByUser(user.id, {
        first,
        after: lastThreadIndex,
      });

      return {
        pageInfo: {
          hasNextPage: threads && threads.length >= first,
        },
        edges: threads.map((thread, index) => ({
          cursor: encode(`${thread.id}-${lastThreadIndex + index + 1}`),
          node: thread,
        })),
      };
    },
    threadConnection: (
      { id }: { id: string },
      {
        first,
        after,
        kind,
      }: { ...PaginationOptions, kind: 'creator' | 'participant' },
      { user }: GraphQLContext
    ) => {
      const currentUser = user;
      const cursor = decode(after);
      // Get the index from the encoded cursor, asdf234gsdf-2 => ["-2", "2"]
      const lastDigits = cursor.match(/-(\d+)$/);
      const lastThreadIndex =
        lastDigits && lastDigits.length > 0 && parseInt(lastDigits[1], 10);
      // if a logged in user is viewing the profile, handle logic to get viewable threads

      let getThreads;
      if (currentUser) {
        getThreads =
          kind === 'creator'
            ? // $FlowIssue
              getViewableThreadsByUser(id, currentUser.id, {
                first,
                after: lastThreadIndex,
              })
            : // $FlowIssue
              getViewableParticipantThreadsByUser(id, currentUser.id, {
                first,
                after: lastThreadIndex,
              });
      } else {
        getThreads =
          kind === 'creator'
            ? // $FlowIssue
              getPublicThreadsByUser(id, { first, after: lastThreadIndex })
            : // $FlowIssue
              getPublicParticipantThreadsByUser(id, {
                first,
                after: lastThreadIndex,
              });
      }

      return getThreads.then(result => ({
        pageInfo: {
          // $FlowFixMe => super weird
          hasNextPage: result && result.length >= first,
        },
        edges: result.map((thread, index) => ({
          cursor: encode(`${thread.id}-${lastThreadIndex + index + 1}`),
          node: thread,
        })),
      }));
    },
    threadCount: (
      { id }: { id: string },
      _: any,
      { loaders }: GraphQLContext
    ) => {
      return loaders.userThreadCount
        .load(id)
        .then(data => (data ? data.count : 0));
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

      return loaders.userRecurringPayments.load(user.id).then(result => {
        const subs = result && result.reduction;
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
    invoices: (_: any, __: any, { user }: GraphQLContext) => {
      const currentUser = user;
      if (!currentUser)
        return new UserError('You must be logged in to view these settings.');

      return getInvoicesByUser(currentUser.id);
    },
    totalReputation: ({ id }: DBUser, _: any, { loaders }: GraphQLContext) => {
      if (!id) return 0;
      return loaders.userTotalReputation
        .load(id)
        .then(data => (data ? data.reputation : 0));
    },
    isAdmin: ({ id }: DBUser) => isAdmin(id),
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
              communityId,
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
              communityId,
              reputation,
              isModerator,
              isOwner,
            };
          }
          // eslint-disable-next-line
          case 'loadMoreCommunityMembers':
          case 'getChannelMembers': {
            const channelId = info.variableValues.id;
            const { communityId } = await getChannelById(channelId);
            const {
              reputation,
              isModerator,
              isOwner,
            } = await loaders.userPermissionsInCommunity.load([
              user.id,
              communityId,
            ]);
            return {
              communityId,
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
              communityId: id,
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
