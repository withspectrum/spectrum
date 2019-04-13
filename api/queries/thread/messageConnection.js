// @flow
const debug = require('debug')('api:thread-message-connection');
import type { GraphQLContext } from '../../';
import type { DBThread } from 'shared/types';
import type { PaginationOptions } from '../../utils/paginate-arrays';
import UserError from '../../utils/UserError';
import { encode, decode } from '../../utils/base64';
import { getMessages } from '../../models/message';
import { trackUserThreadLastSeenQueue } from 'shared/bull/queues';

export default (
  { id }: DBThread,
  {
    first,
    after,
    last,
    before,
  }: { ...PaginationOptions, last: number, before: string },
  { user }: GraphQLContext
) => {
  // Make sure users don't provide bonkers arguments that paginate in both directions at the same time
  if (
    (first && last) ||
    (after && before) ||
    (first && before) ||
    (after && last)
  ) {
    debug('invalid pagination options provided:');
    debug(
      'first:',
      first,
      ' last:',
      last,
      ' after:',
      after,
      ' before:',
      before
    );
    return new UserError(
      'Cannot paginate back- and forwards at the same time. Please only ask for the first messages after a certain point or the last messages before a certain point.'
    );
  }

  debug(`get messages for ${id}`);
  let cursor = after || before;
  try {
    cursor = decode(cursor);
    if (cursor) cursor = parseInt(cursor, 10);
  } catch (err) {
    console.error('❌ Error in job:\n');
    console.error(err);
    return new UserError('Invalid cursor passed to thread.messageConnection.');
  }
  if (cursor) debug(`cursor: ${cursor}`);

  let options = {
    // Default first/last to 25 if their counterparts after/before are provided
    // so users can query messageConnection(after: "cursor") or (before: "cursor")
    // without any more options
    first: first ? first : after ? 25 : null,
    last: last ? last : before ? 25 : null,
    // Set after/before to the cursor depending on which one was requested by the user
    after: after ? cursor : null,
    before: before ? cursor : null,
  };

  // If we didn't get any arguments at all (i.e messageConnection {})
  // then just fetch the first 25 messages
  // $FlowIssue
  if (Object.keys(options).every(key => !options[key])) {
    options = {
      first: 25,
    };
  }

  debug('pagination options for query:', options);

  // Load one message too much so that we know whether there's
  // a next or previous page
  options.first && options.first++;
  options.last && options.last++;

  return getMessages(id, options).then(result => {
    if (user && user.id) {
      trackUserThreadLastSeenQueue.add({
        threadId: id,
        userId: user.id,
        timestamp: Date.now(),
      });
    }
    let messages = result;
    // Check if more messages were returned than were requested, which would mean
    // there's a next/previous page. (depending on the direction of the pagination)
    const loadedMoreFirst = options.first && result.length > options.first - 1;
    const loadedMoreLast = options.last && result.length > options.last - 1;

    // Get rid of the extranous message if there is one
    if (loadedMoreFirst) {
      debug('not sending extranous message loaded first');
      messages = result.slice(0, result.length - 1);
    } else if (loadedMoreLast) {
      debug('not sending extranous message loaded last');
      messages = result.reverse().slice(1, result.length);
    }

    return {
      pageInfo: {
        // Use the extranous message that was maybe loaded to figure out whether
        // there is a next/previous page, otherwise just try and guess based on
        // if a cursor was provided
        // $FlowIssue
        hasNextPage: loadedMoreFirst || !!options.before,
        // $FlowIssue
        hasPreviousPage: loadedMoreLast || !!options.after,
      },
      edges: messages.map(message => ({
        cursor: encode(message.timestamp.getTime().toString()),
        node: message,
      })),
    };
  });
};
