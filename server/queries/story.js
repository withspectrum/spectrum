//@flow

/**
 * Story query resolvers
 */
const { getStory } = require('../models/story');
const { getFrequency } = require('../models/frequency');
const {
  getMessagesByLocationAndThread,
  getMessageCount,
} = require('../models/message');
const { getUser } = require('../models/user');
import paginate from '../utils/paginate-arrays';
import type { LocationTypes } from '../models/message';
import type { PaginationOptions } from '../utils/paginate-arrays';
import { encode, decode } from '../utils/base64';

module.exports = {
  Query: {
    story: (_: any, { id }: { id: String }) => getStory(id),
  },
  Story: {
    frequency: ({ frequency }: { frequency: String }) =>
      getFrequency({ id: frequency }),
    messageConnection: (
      { id }: { id: String },
      { first = 100, after }: PaginationOptions
    ) => {
      const cursor = decode(after);
      return getMessagesByLocationAndThread('messages', id, {
        first,
        after: cursor,
      })
        .then(messages =>
          paginate(
            messages,
            { first, after: cursor },
            message => message.id === cursor
          )
        )
        .then(result => ({
          pageInfo: {
            hasNextPage: result.hasMoreItems,
          },
          edges: result.list.map(message => ({
            cursor: encode(message.id),
            node: message,
          })),
        }));
    },
    author: ({ author }: { author: String }) => getUser({ uid: author }),
    messageCount: ({ id }: { id: string }) => getMessageCount('messages', id),
  },
};
