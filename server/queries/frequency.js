// @flow
/**
 * Frequency query resolvers
 */
const {
  getFrequency,
  getFrequencyMetaData,
  getFrequencySubscriberCount,
  getTop30Frequencies,
} = require('../models/frequency');
const { getStoriesByFrequency } = require('../models/story');
const { getCommunity } = require('../models/community');
const { getUsers } = require('../models/user');
import paginate from '../utils/paginate-arrays';
import { encode, decode } from '../utils/base64';
import type { PaginationOptions } from '../utils/paginate-arrays';
import type { GetFrequencyArgs } from '../models/frequency';

module.exports = {
  Query: {
    frequency: (_: any, args: GetFrequencyArgs) => getFrequency(args),
    topFrequencies: (_: any, { amount = 30 }: { amount: number }) =>
      getTop30Frequencies(amount),
  },
  Frequency: {
    subscriberCount: ({ id }: { id: string }) =>
      getFrequencySubscriberCount(id),
    storyConnection: (
      { id }: { id: string },
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
      getCommunity({ id: community }),
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
