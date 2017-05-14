// @flow
/**
 * Frequency query resolvers
 */
const {
  getFrequencyBySlug,
  getFrequencyMetaData,
  getFrequencySubscriberCount,
  getTopFrequencies,
} = require('../models/frequency');
const { getStoriesByFrequency } = require('../models/story');
import paginate from '../utils/paginate-arrays';
import { encode, decode } from '../utils/base64';
import type { PaginationOptions } from '../utils/paginate-arrays';
import type { GetFrequencyArgs } from '../models/frequency';
import type { GraphQLContext } from '../';

module.exports = {
  Query: {
    frequency: (
      _: any,
      args: GetFrequencyArgs,
      { loaders }: GraphQLContext
    ) => {
      if (args.id) return loaders.frequency.load(args.id);
      if (args.slug && args.community)
        return getFrequencyBySlug(args.slug, args.community);
      return null;
    },
    topFrequencies: (_: any, { amount = 30 }: { amount: number }) =>
      getTopFrequencies(amount),
  },
  Frequency: {
    subscriberCount: ({ id }: { id: string }) =>
      getFrequencySubscriberCount(id),
    storyConnection: (
      { id }: { id: string },
      { first = 10, after }: PaginationOptions
    ) => {
      const cursor = decode(after);
      return getStoriesByFrequency(id, { first, after: cursor })
        .then(stories =>
          paginate(
            stories,
            { first, after: cursor },
            story => story.id === cursor
          )
        )
        .then(result => ({
          pageInfo: {
            hasNextPage: result.hasMoreItems,
          },
          edges: result.list.map(story => ({
            cursor: encode(story.id),
            node: story,
          })),
        }));
    },
    blockedUsers: ({ blockedUsers }, _, { loaders }: GraphQLContext) => {
      return loaders.user.loadMany(blockedUsers).then(users => users);
    },
    pendingUsers: ({ pendingUsers }, _, { loaders }: GraphQLContext) => {
      return loaders.user.loadMany(pendingUsers).then(users => users);
    },
    isOwner: ({ owners }, _, { user }) => {
      if (!user) return false;
      return owners.indexOf(user.uid) > -1;
    },
    isSubscriber: ({ subscribers }, _, { user }) => {
      if (!user) return false;
      return subscribers.indexOf(user.uid) > -1;
    },
    isPending: ({ pendingUsers }, _, { user }) => {
      if (!user) return false;
      return pendingUsers.indexOf(user.uid) > -1;
    },
    isBlocked: ({ blockedUsers }, _, { user }) => {
      if (!user) return false;
      return blockedUsers.indexOf(user.uid) > -1;
    },
    community: (
      { community }: { community: string },
      _: any,
      { loaders }: GraphQLContext
    ) => loaders.community.load(community),
    subscriberConnection: (
      { subscribers }: { subscribers: Array<string> },
      { first = 10, after }: PaginationOptions,
      { loaders }: GraphQLContext
    ) => {
      const { list, hasMoreItems } = paginate(subscribers, {
        first,
        after: decode(after),
      });
      return loaders.user.loadMany(list).then(users => ({
        pageInfo: {
          hasNextPage: hasMoreItems,
        },
        edges: users.map(user => ({
          cursor: encode(user.uid),
          node: user,
        })),
      }));
    },
    metaData: ({ id }: { id: string }) => {
      return getFrequencyMetaData(id).then(data => {
        return {
          stories: data[0],
          subscribers: data[1],
        };
      });
    },
  },
};
