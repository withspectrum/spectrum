//@flow

/**
 * Story query resolvers
 */
const { getFrequency } = require('../models/frequency');
const {
  getMessagesByLocationAndThread,
  getMessageCount,
} = require('../models/message');
import paginate from '../utils/paginate-arrays';
import type { LocationTypes } from '../models/message';
import type { PaginationOptions } from '../utils/paginate-arrays';
import type { GraphQLContext } from '../';
import { encode, decode } from '../utils/base64';

module.exports = {
  Query: {
    story: (_: any, { id }: { id: string }, { loaders }: GraphQLContext) =>
      loaders.story.load(id),
  },
  Story: {
    frequency: (
      { frequency }: { frequency: string },
      _: any,
      { loaders }: GraphQLContext
    ) => loaders.frequency.load(frequency),
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
    author: (
      { author }: { author: String },
      _: any,
      { loaders }: GraphQLContext
    ) => loaders.user.load(author),
    messageCount: ({ id }: { id: string }) => getMessageCount('messages', id),
  },
};
