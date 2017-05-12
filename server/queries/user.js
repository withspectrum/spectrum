// @flow
/**
 * Story query resolvers
 */
const { getEverything, getUser } = require('../models/user');
const { getCommunitiesByUser } = require('../models/community');
const { getFrequenciesByUser } = require('../models/frequency');
const { getStoriesByUser } = require('../models/story');
const {
  getDirectMessageGroupsByUser,
} = require('../models/directMessageGroup');
const { getNotificationsByUser } = require('../models/notification');
import paginate from '../utils/paginate-arrays';
import { encode, decode } from '../utils/base64';
import { isAdmin } from '../utils/permissions';
import type { PaginationOptions } from '../utils/paginate-arrays';
import type { GetUserArgs } from '../models/frequency';
import type { GraphQLContext } from '../';

module.exports = {
  Query: {
    user: (
      _: any,
      args: { uid: string, username: string },
      { loaders }: GraphQLContext
    ) => {
      if (args.uid) return loaders.user.load(args.uid);
      if (args.username) return getUser({ username: args.username });
      return null;
    },
    currentUser: (_: any, __: any, { user }: GraphQLContext) => user,
  },
  User: {
    notificationConnection: (
      { uid }: { uid: string },
      { first = 10, after }: PaginationOptions,
      { user }: GraphQLContext
    ) => {
      if (!user || user.uid !== uid) return null;
      return getNotificationsByUser(uid, { first, after });
    },
    isAdmin: ({ uid }: { uid: string }) => {
      return isAdmin(uid);
    },
    everything: (
      { uid }: { uid: string },
      { first = 10, after }: PaginationOptions
    ) => {
      const cursor = decode(after);
      // TODO: Make this more performant by doing an actual db query rather than this hacking around
      return getEverything(uid)
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
    communityConnection: (user: Object) => ({
      // Don't paginate communities and frequencies of a user
      pageInfo: {
        hasNextPage: false,
      },
      edges: getCommunitiesByUser(user.uid).then(communities =>
        communities.map(community => ({
          node: {
            ...community,
            isOwner: community.owners.indexOf(user.uid) > -1,
          },
        }))
      ),
    }),
    frequencyConnection: (user: Object) => ({
      pageInfo: {
        hasNextPage: false,
      },
      edges: getFrequenciesByUser(user.uid).then(frequencies =>
        frequencies.map(frequency => ({
          node: frequency,
        }))
      ),
    }),
    directMessageGroupsConnection: (user: Object) => ({
      pageInfo: {
        hasNextPage: false,
      },
      edges: getDirectMessageGroupsByUser(user.uid).then(groups =>
        groups.map(group => ({
          node: group,
        }))
      ),
    }),
    storyConnection: (
      { uid }: { uid: string },
      { first = 10, after }: PaginationOptions
    ) => {
      const cursor = decode(after);
      return getStoriesByUser(uid, { first, after: cursor })
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
    storyCount: (
      { uid }: { uid: string },
      _: any,
      { loaders }: GraphQLContext
    ) => {
      return loaders.userStoryCount.load(uid).then(data => data.count);
    },
  },
};
