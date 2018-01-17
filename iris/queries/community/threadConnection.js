// @flow
import type { DBCommunity } from 'shared/types';
import type { PaginationOptions } from '../../utils/paginate-arrays';
import type { GraphQLContext } from '../../';
import { encode, decode } from '../../utils/base64';
import UserError from '../../utils/UserError';
import {
  getChannelsByUserAndCommunity,
  getPublicChannelsByCommunity,
} from '../../models/channel';
import { getThreadsByChannels } from '../../models/thread';

export default async (
  { id }: DBCommunity,
  {
    first,
    after,
    last,
    before,
  }: { first: number, after: string, last: number, before: string },
  { user }: GraphQLContext
) => {
  // Make sure users don't provide bonkers arguments that paginate in both directions at the same time
  if (
    (first && last) ||
    (after && before) ||
    (first && before) ||
    (after && last)
  ) {
    throw new UserError(
      'Cannot paginate back- and forwards at the same time. Please only ask for the first messages after a certain point or the last messages before a certain point.'
    );
  }
  const cursor = decode(after || before);
  // Get the index from the encoded cursor, asdf234gsdf-2 => ["-2", "2"]
  const lastDigits = cursor.match(/-(\d+)$/);
  let lastThreadIndex =
    lastDigits && lastDigits.length > 0 && parseInt(lastDigits[1], 10);
  if (typeof lastThreadIndex !== 'number') {
    if (!!after || !!before) {
      throw new UserError(
        'Invalid cursor provided to',
        !!after ? 'after.' : 'before.'
      );
    }
    lastThreadIndex = null;
  }
  const currentUser = user;

  // if the user is signed in, only return stories for the channels
  // the user is a member of -> this will ensure that they don't see
  // stories in private channels that they aren't a member of.
  // if the user is *not* signed in, only get threads from public channels
  // within the community
  let channels;
  if (user) {
    channels = await getChannelsByUserAndCommunity(id, currentUser.id);
  } else {
    channels = await getPublicChannelsByCommunity(id);
  }

  let options = {
    // Default first/last to 50 if their counterparts after/before are provided
    // so users can query messageConnection(after: "cursor") or (before: "cursor")
    // without any more options
    first: first ? first : after ? 20 : null,
    last: last ? last : before ? 20 : null,
    // Set after/before to the cursor depending on which one was requested by the user
    after: after ? lastThreadIndex : null,
    before: before ? lastThreadIndex : null,
  };

  // If we didn't get any arguments at all (i.e messageConnection {})
  // then just fetch the first 50 messages
  // $FlowIssue
  if (Object.keys(options).every(key => !options[key])) {
    options = {
      first: 50,
    };
  }

  const threads = await getThreadsByChannels(channels, options);

  return {
    pageInfo: {
      hasNextPage: threads && threads.length >= first,
    },
    edges: threads.map((thread, index) => ({
      cursor: encode(`${thread.id}-${lastThreadIndex + index + 1}`),
      node: thread,
    })),
  };
};
