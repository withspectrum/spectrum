// @flow
import type { GraphQLContext } from '../../';
import type { DBThread } from 'shared/types';
import type { PaginationOptions } from '../../utils/paginate-arrays';
import { encode, decode } from '../../utils/base64';
import { getMessages } from '../../models/message';
import { addQueue } from '../../utils/workerQueue';
import { TRACK_USER_THREAD_LAST_SEEN } from 'shared/bull/queues';

export default (
  { id }: DBThread,
  { first = 999999, after }: PaginationOptions,
  { user }: GraphQLContext
) => {
  const cursor = decode(after);
  // Get the index from the encoded cursor, asdf234gsdf-2 => ["-2", "2"]
  const lastDigits = cursor.match(/-(\d+)$/);
  const lastMessageIndex =
    lastDigits && lastDigits.length > 0 && parseInt(lastDigits[1], 10);
  return getMessages(id, {
    // Only send down 200 messages for the watercooler?
    first,
    after: lastMessageIndex,
  }).then(result => {
    if (user && user.id) {
      addQueue(TRACK_USER_THREAD_LAST_SEEN, {
        threadId: id,
        userId: user.id,
        timestamp: Date.now(),
      });
    }
    return {
      pageInfo: {
        hasNextPage: result && result.length >= first,
      },
      edges: result.map((message, index) => ({
        cursor: encode(`${message.id}-${lastMessageIndex + index + 1}`),
        node: message,
      })),
    };
  });
};
