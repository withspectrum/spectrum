// @flow
/**
 * Frequency query resolvers
 */
const {
  getFrequency,
  getFrequencyMetaData,
  getFrequencySubscriberCount,
} = require('../models/frequency');
const { getStoriesByFrequency } = require('../models/story');
const { getCommunity } = require('../models/community');
const { getUsers } = require('../models/user');
import paginate from '../utils/paginate-arrays';
import type { PaginationOptions } from '../utils/paginate-arrays';
import { encode, decode } from '../utils/base64';

module.exports = {
  Query: {
    frequency: (_: any, { id }: { id: String }) => getFrequency(id),
  },
  Frequency: {
    storyConnection: (
      { id }: { id: String },
      { first = 10, after }: PaginationOptions
    ) => {
      const cursorId = decode(after);
      return getStoriesByFrequency(id, { first, after: cursorId }).then(([
        stories,
        lastStory,
      ]) => ({
        pageInfo: {
          hasNextPage: stories.length > 0
            ? lastStory.id === stories[stories.length - 1].id
            : lastStory.id === cursorId,
        },
        edges: stories.map(story => ({
          cursor: encode(story.id),
          node: story,
        })),
      }));
    },
    community: ({ community }: { community: String }) =>
      getCommunity(community),
    subscriberConnection: (
      { subscribers }: { subscribers: Array<string> },
      { first = 10, after }: PaginationOptions
    ) => {
      const { list, hasMoreItems } = paginate(subscribers, {
        first,
        after: decode(after),
      });
      return getUsers(list).then(users => ({
        pageInfo: {
          hasNextPage: hasMoreItems,
        },
        edges: users.map(user => ({
          cursor: encode(user.uid),
          node: user,
        })),
      }));
    },
    metaData: ({ id }: { id: String }) => {
      return getFrequencyMetaData(id).then(data => {
        return {
          stories: data[0],
          subscribers: data[1],
        };
      });
    },
  },
};
