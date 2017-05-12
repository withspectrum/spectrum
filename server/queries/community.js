// @flow
/**
 * Community query resolvers
 */
const {
  getCommunityMetaData,
  getAllCommunityStories,
} = require('../models/community');
const { getFrequenciesByCommunity } = require('../models/frequency');
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
  },
  Community: {
    frequencyConnection: ({ id }: { id: string }) => ({
      pageInfo: {
        hasNextPage: false,
      },
      edges: getFrequenciesByCommunity(id).then(frequencies =>
        frequencies.map(frequency => ({
          node: frequency,
        }))
      ),
    }),
    isOwner: ({ owners }, _, { user }) => {
      if (!user) return false;
      return owners.indexOf(user.uid) > -1;
    },
    isMember: ({ members }, _, { user }) => {
      if (!user) return false;
      return members.indexOf(user.uid) > -1;
    },
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
          cursor: encode(user.uid),
          node: user,
        })),
      }));
    },
    storyConnection: (
      { id }: { id: string },
      { first = 10, after }: PaginationOptions
    ) => {
      const cursor = decode(after);
      // TODO: Make this more performant by doing an actual db query rather than this hacking around
      return getAllCommunityStories(id)
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
    metaData: ({ id }: { id: String }) => {
      return getCommunityMetaData(id).then(data => {
        return {
          frequencies: data[0],
          members: data[1],
        };
      });
    },
  },
};
