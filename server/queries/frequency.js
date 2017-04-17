// @flow
/**
 * Frequency query resolvers
 */
const { getFrequency } = require('../models/frequency');
const { getStoriesByFrequency } = require('../models/story');
const { getCommunity } = require('../models/community');
const { getUsers } = require('../models/user');
import paginate from '../utils/paginate-arrays';
import type { PaginationOptions } from '../utils/paginate-arrays';

module.exports = {
  Query: {
    frequency: (_: any, { id }: { id: String }) => getFrequency(id),
  },
  Frequency: {
    storyConnection: (
      { id }: { id: String },
      { first = 10, after }: PaginationOptions
    ) =>
      getStoriesByFrequency(id, { first, after }).then(([
        stories,
        lastStory,
      ]) => ({
        pageInfo: {
          hasNextPage: stories.length > 0
            ? lastStory.id === stories[stories.length - 1].id
            : lastStory.id === after,
        },
        edges: stories.map(story => ({
          cursor: story.id,
          node: story,
        })),
      })),
    community: ({ community }: { community: String }) =>
      getCommunity(community),
    subscriberConnection: (
      { subscribers }: { subscribers: Array<string> },
      { first = 10, after }: PaginationOptions
    ) => {
      const { list, hasMoreItems } = paginate(subscribers, { first, after });
      return getUsers(list).then(users => ({
        pageInfo: {
          hasNextPage: hasMoreItems,
        },
        edges: users.map(user => ({
          cursor: user.uid,
          node: user,
        })),
      }));
    },
  },
};
