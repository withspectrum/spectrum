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
const { getUserByUid } = require('../models/user');
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
      { first = 10, after }: PaginationOptions
    ) => {
      const cursorId = decode(after);
      return getMessagesByLocationAndThread('messages', id, {
        first,
        after: cursorId,
      }).then(([messages, lastMessage]) => ({
        pageInfo: {
          hasNextPage: messages.length > 0
            ? lastMessage.id !== messages[messages.length - 1].id
            : lastMessage.id !== cursorId,
        },
        edges: messages.map(message => ({
          cursor: encode(message.id),
          node: message,
        })),
      }));
    },
    author: ({ author }: { author: String }) => getUserByUid(author),
    messageCount: ({ id }: { id: string }) => getMessageCount('messages', id),
  },
};
