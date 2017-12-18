// @flow
/**
 * Community query resolvers
 */
import UserError from '../utils/UserError';
const {
  getRecentCommunities,
  getCommunityById,
  getMemberCount,
  getThreadCount,
  getCommunityGrowth,
} = require('../models/community');
import {
  getPublicChannelIdsInCommunity,
  getPrivateChannelIdsInCommunity,
  getUsersJoinedPrivateChannelIds,
} from '../models/search';
import { getCuratedCommunities } from '../models/curatedContent';
const { getTopMembersInCommunity } = require('../models/reputationEvents');
const { getMembersInCommunity } = require('../models/usersCommunities');
import { getMessageCount } from '../models/message';
const {
  getThreadsByChannels,
  getThreads,
  getThreadsByCommunityInTimeframe,
} = require('../models/thread');
const {
  getChannelsByCommunity,
  getChannelsByUserAndCommunity,
  getPublicChannelsByCommunity,
} = require('../models/channel');
import { getSlackImport } from '../models/slackImport';
import { getInvoicesByCommunity } from '../models/invoice';
import type { PaginationOptions } from '../utils/paginate-arrays';
import { encode, decode } from '../utils/base64';
import { intersection } from 'lodash';
import type { GraphQLContext } from '../';
import type { DBCommunity } from 'shared/types';
import initIndex from 'shared/algolia';
const communitySearchIndex = initIndex('communities');
const communityThreadsSearchIndex = initIndex('threads_and_messages');

type GetCommunityById = {
  id: string,
  slug: void,
};

type GetCommunityBySlug = {
  id: void,
  slug: string,
};

type GetCommunityArgs = GetCommunityById | GetCommunityBySlug;

type GetCommunitiesByIds = {
  ids: Array<string>,
  slugs: void,
  curatedContentType: void,
};

type GetCommunitiesBySlugs = {
  ids: void,
  slugs: Array<string>,
  curatedContentType: void,
};

type GetCuratedContent = {
  ids: void,
  slugs: void,
  curatedContentType: string,
};

type GetCommunitiesArgs =
  | GetCommunitiesByIds
  | GetCommunitiesBySlugs
  | GetCuratedContent;

type MemberOrChannelCount = {
  reduction?: number,
};

module.exports = {
  Query: {
    community: (
      _: any,
      args: GetCommunityArgs,
      { loaders }: GraphQLContext
    ) => {
      if (args.id) return loaders.community.load(args.id);
      if (args.slug) return loaders.communityBySlug.load(args.slug);

      return null;
    },
    communities: (
      _: any,
      args: GetCommunitiesArgs,
      { loaders }: GraphQLContext
    ) => {
      if (args.curatedContentType) {
        return getCuratedCommunities(args.curatedContentType);
      }
      if (args.ids) return loaders.community.loadMany(args.ids);
      if (args.slugs) return loaders.communityBySlug.loadMany(args.slugs);
      return null;
    },
    topCommunities: () => getCuratedCommunities('top-communities-by-members'),
    recentCommunities: () => getRecentCommunities(),
    searchCommunities: (
      _: any,
      { string, amount = 30 }: { string: string, amount: number },
      { loaders }: GraphQLContext
    ) => {
      return communitySearchIndex
        .search({ query: string })
        .then(content => {
          if (!content.hits || content.hits.length === 0) return [];
          const communityIds = content.hits.map(o => o.objectID);
          return loaders.community.loadMany(communityIds);
        })
        .catch(err => {
          console.log('err', err);
        });
    },
    searchCommunityThreads: async (
      _: any,
      {
        communityId,
        searchString,
      }: { communityId: string, searchString: string },
      { user, loaders }: GraphQLContext
    ) => {
      let getSearchResultThreads = (filters: string) =>
        communityThreadsSearchIndex
          .search({ query: searchString, filters })
          .then(content => {
            if (!content.hits || content.hits.length === 0) return null;
            return content.hits.map(o => ({
              threadId: o.threadId,
              channelId: o.channelId,
              communityId: o.communityId,
              creatorId: o.creatorId,
            }));
          })
          .catch(err => {
            console.log('err', err);
          });

      const IS_AUTHED_USER = user && user.id;

      const filters = `communityId:"${communityId}"`;
      let searchResultThreads = await getSearchResultThreads(filters);

      // if no threads exist, send an empty array to the client
      if (!searchResultThreads || searchResultThreads.length === 0) return [];

      const getCommunity = getCommunityById(communityId);
      const getPublicChannelIds = getPublicChannelIdsInCommunity(communityId);
      const getPrivateChannelIds = IS_AUTHED_USER
        ? getPrivateChannelIdsInCommunity(communityId)
        : [];
      const getCurrentUsersChannelIds = IS_AUTHED_USER
        ? getUsersJoinedPrivateChannelIds(user.id)
        : [];

      const [
        community,
        publicChannels,
        privateChannels,
        currentUsersPrivateChannels,
      ] = await Promise.all([
        getCommunity,
        getPublicChannelIds,
        getPrivateChannelIds,
        getCurrentUsersChannelIds,
      ]);

      // community is deleted or not found
      if (!community || community.deletedAt) return [];

      const privateChannelsWhereUserIsMember = intersection(
        privateChannels,
        currentUsersPrivateChannels
      );
      const availableChannelsForSearch = [
        ...publicChannels,
        ...privateChannelsWhereUserIsMember,
      ];

      searchResultThreads = searchResultThreads
        .filter(t => availableChannelsForSearch.indexOf(t.channelId) >= 0)
        .filter(t => t.communityId === communityId);

      return loaders.thread
        .loadMany(searchResultThreads.map(t => t.threadId))
        .then(data => data.filter(thread => thread && !thread.deletedAt));
    },
  },
  Community: {
    communityPermissions: (
      { id }: DBCommunity,
      _: any,
      { user, loaders }: GraphQLContext
    ) => {
      if (!id || !user) return {};
      return loaders.userPermissionsInCommunity
        .load([user.id, id])
        .then(result => (result ? result : {}));
    },
    channelConnection: ({ id }: DBCommunity) => ({
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
      { id }: DBCommunity,
      { first = 10, after }: PaginationOptions,
      { loaders }: GraphQLContext
    ) => {
      const cursor = decode(after);
      // Get the index from the encoded cursor, asdf234gsdf-2 => ["-2", "2"]
      const lastDigits = cursor.match(/-(\d+)$/);
      const lastUserIndex =
        lastDigits && lastDigits.length > 0 && parseInt(lastDigits[1], 10);

      // $FlowFixMe
      return getMembersInCommunity(id, { first, after: lastUserIndex })
        .then(users => loaders.user.loadMany(users))
        .then(result => ({
          pageInfo: {
            hasNextPage: result && result.length >= first,
          },
          edges: result.filter(Boolean).map((user, index) => ({
            cursor: encode(`${user.id}-${lastUserIndex + index + 1}`),
            node: user,
          })),
        }));
    },
    pinnedThread: async ({ pinnedThreadId }: DBCommunity) => {
      let pinnedThread;
      if (pinnedThreadId) {
        pinnedThread = await getThreads([pinnedThreadId]);
      }

      if (
        pinnedThread &&
        Array.isArray(pinnedThread) &&
        pinnedThread.length > 0
      )
        return pinnedThread[0];
      return null;
    },
    threadConnection: async (
      { id, ...community }: DBCommunity,
      { first = 10, after }: PaginationOptions,
      { user }: GraphQLContext
    ) => {
      const cursor = decode(after);
      // Get the index from the encoded cursor, asdf234gsdf-2 => ["-2", "2"]
      const lastDigits = cursor.match(/-(\d+)$/);
      const lastThreadIndex =
        lastDigits && lastDigits.length > 0 && parseInt(lastDigits[1], 10);
      const currentUser = user;

      // if the user is signed in, only return stories for the channels
      // the user is a member of -> this will ensure that they don't see
      // stories in private channels that they aren't a member of.
      // if the user is *not* signed in, only get threads from public channels
      // within the community
      let channels;
      if (user) {
        channels = await getChannelsByUserAndCommunity(id, currentUser.id);
      } else {
        channels = await getPublicChannelsByCommunity(id);
      }

      // $FlowFixMe
      const threads = await getThreadsByChannels(channels, {
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
    metaData: ({ id }: DBCommunity, _: any, { loaders }: GraphQLContext) => {
      // $FlowIssue
      return Promise.all([
        loaders.communityChannelCount.load(id),
        loaders.communityMemberCount.load(id),
      ]).then(
        (
          [channelCount, memberCount]: [
            MemberOrChannelCount,
            MemberOrChannelCount,
          ]
        ) => ({
          channels: channelCount ? channelCount.reduction : 0,
          members: memberCount ? memberCount.reduction : 0,
        })
      );
    },
    slackImport: async (
      { id }: DBCommunity,
      _: any,
      { user, loaders }: GraphQLContext
    ) => {
      const currentUser = user;
      if (!currentUser)
        return new UserError(
          'You must be logged in to view community settings.'
        );

      // only community owners should be able to query for their slack team
      const { isOwner } = await loaders.userPermissionsInCommunity.load([
        currentUser.id,
        id,
      ]);
      if (!isOwner) return null;

      return getSlackImport(id).then(data => {
        if (!data) return null;
        return {
          teamName: data.teamName,
          members: data.members ? JSON.stringify(data.members) : null,
          sent: data.sent || null,
        };
      });
    },
    invoices: ({ id }: DBCommunity, _: any, { user }: GraphQLContext) => {
      const currentUser = user;
      if (!currentUser)
        return new UserError(
          'You must be logged in to view community settings.'
        );

      return getInvoicesByCommunity(id);
    },
    recurringPayments: (
      { id }: DBCommunity,
      _: any,
      { user, loaders }: GraphQLContext
    ) => {
      const currentUser = user;

      if (!currentUser) {
        return new UserError('You must be signed in to continue.');
      }

      const queryRecurringPayments = async () => {
        const userPermissions = await loaders.userPermissionsInCommunity.load([
          currentUser.id,
          id,
        ]);
        if (!userPermissions.isOwner) return;

        const results = await loaders.communityRecurringPayments.load(id);
        const rPayments = results && results.reduction;

        const communitySubscriptions =
          rPayments &&
          rPayments.length > 0 &&
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
    memberGrowth: async (
      { id }: DBCommunity,
      _: any,
      { user, loaders }: GraphQLContext
    ) => {
      const currentUser = user;

      if (!currentUser) {
        return new UserError('You must be signed in to continue.');
      }

      const { isOwner } = await loaders.userPermissionsInCommunity.load([
        currentUser.id,
        id,
      ]);

      if (!isOwner) {
        return new UserError(
          'You must be the owner of this community to view analytics.'
        );
      }

      return {
        count: await getMemberCount(id),
        weeklyGrowth: await getCommunityGrowth(
          'usersCommunities',
          'weekly',
          'createdAt',
          id,
          {
            isMember: true,
          }
        ),
        monthlyGrowth: await getCommunityGrowth(
          'usersCommunities',
          'monthly',
          'createdAt',
          id,
          {
            isMember: true,
          }
        ),
        quarterlyGrowth: await getCommunityGrowth(
          'usersCommunities',
          'quarterly',
          'createdAt',
          id,
          {
            isMember: true,
          }
        ),
      };
    },
    conversationGrowth: async (
      { id }: DBCommunity,
      __: any,
      { user, loaders }: GraphQLContext
    ) => {
      const currentUser = user;

      if (!currentUser) {
        return new UserError('You must be signed in to continue.');
      }

      const { isOwner } = await loaders.userPermissionsInCommunity.load([
        currentUser.id,
        id,
      ]);

      if (!isOwner) {
        return new UserError(
          'You must be the owner of this community to view analytics.'
        );
      }

      return {
        count: await getThreadCount(id),
        weeklyGrowth: await getCommunityGrowth(
          'threads',
          'weekly',
          'createdAt',
          id
        ),
        monthlyGrowth: await getCommunityGrowth(
          'threads',
          'monthly',
          'createdAt',
          id
        ),
        quarterlyGrowth: await getCommunityGrowth(
          'threads',
          'quarterly',
          'createdAt',
          id
        ),
      };
    },
    topMembers: async (
      { id }: DBCommunity,
      __: any,
      { user, loaders }: GraphQLContext
    ) => {
      const currentUser = user;

      if (!currentUser) {
        return new UserError('You must be signed in to continue.');
      }

      const { isOwner } = await loaders.userPermissionsInCommunity.load([
        currentUser.id,
        id,
      ]);

      if (!isOwner) {
        return new UserError(
          'You must be the owner of this community to view analytics.'
        );
      }

      return getTopMembersInCommunity(id).then(users => {
        if (!users) return [];
        return loaders.user.loadMany(users);
      });
    },
    topAndNewThreads: (
      { id }: DBCommunity,
      __: any,
      { user }: GraphQLContext
    ) => {
      const currentUser = user;

      if (!currentUser) {
        return new UserError('You must be signed in to continue.');
      }

      return getThreadsByCommunityInTimeframe(
        id,
        'week'
      ).then(async threads => {
        if (!threads) return { topThreads: [], newThreads: [] };

        const messageCountPromises = threads.map(async ({ id }) => ({
          id,
          messageCount: await getMessageCount(id),
        }));

        // promise all the active threads and message counts
        const threadsWithMessageCounts = await Promise.all(
          messageCountPromises
        );

        const topThreads = threadsWithMessageCounts
          .filter(t => t.messageCount > 0)
          .sort((a, b) => {
            const bc = parseInt(b.messageCount, 10);
            const ac = parseInt(a.messageCount, 10);
            return bc <= ac ? -1 : 1;
          })
          .slice(0, 10)
          .map(t => t.id);

        const newThreads = threadsWithMessageCounts
          .filter(t => t.messageCount === 0)
          .map(t => t.id);

        return {
          topThreads: await getThreads([...topThreads]),
          newThreads: await getThreads([...newThreads]),
        };
      });
    },
    isPro: ({ id }: DBCommunity, _: any, { loaders }: GraphQLContext) => {
      return loaders.communityRecurringPayments.load(id).then(res => {
        const subs = res && res.reduction;
        if (!subs || subs.length === 0) return false;
        if (!Array.isArray(subs)) return subs.status === 'active';

        return subs.some(sub => sub.status === 'active');
      });
    },
    contextPermissions: (
      community: DBCommunity,
      _: any,
      { loaders }: GraphQLContext,
      info: any
    ) => {
      // in some cases we fetch this upstream - e.g. in the case of querying for communitysThreads, we need to fetch contextPermissions before we hit this step as threadIds are not included in the query variables
      if (community.contextPermissions) return community.contextPermissions;

      const queryName = info.operation.name.value;

      const handleCheck = async () => {
        switch (queryName) {
          case 'getUser': {
            const username = info.variableValues.username;
            const user = await loaders.userByUsername.load(username);
            const {
              reputation,
              isModerator,
              isOwner,
            } = await loaders.userPermissionsInCommunity.load([
              user.id,
              community.id,
            ]);
            return {
              communityId: community.id,
              reputation,
              isModerator,
              isOwner,
            };
          }
        }
      };

      return handleCheck();
    },
    watercooler: async ({ watercoolerId }: DBCommunity) => {
      if (!watercoolerId) return null;
      return await getThreads([watercoolerId]).then(
        res => (res && res.length > 0 ? res[0] : null)
      );
    },
  },
};
