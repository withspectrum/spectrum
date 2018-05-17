// @flow
import type { DBCommunity } from 'shared/types';
import type { PaginationOptions } from '../../utils/paginate-arrays';
import type { GraphQLContext } from '../../';
import { encode, decode } from '../../utils/base64';
import {
  getChannelsByUserAndCommunity,
  getPublicChannelsByCommunity,
} from '../../models/channel';
import { getThreadsByChannels } from '../../models/thread';
import { canViewCommunity } from '../../utils/permissions';

// prettier-ignore
export default async (root: DBCommunity, args: PaginationOptions, ctx: GraphQLContext) => {
  const { first = 10, after } = args
  const { user, loaders } = ctx
  const { id } = root

  if (!await canViewCommunity(user.id, id, loaders)) {
    return {
      pageInfo: {
        hasNextPage: false,
      },
      edges: []
    }
  }

  const cursor = decode(after);
  // Get the index from the encoded cursor, asdf234gsdf-2 => ["-2", "2"]
  const lastDigits = cursor.match(/-(\d+)$/);
  const lastThreadIndex =
    lastDigits && lastDigits.length > 0 && parseInt(lastDigits[1], 10);
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

  // $FlowFixMe
  const threads = await getThreadsByChannels(channels, {
    first,
    after: lastThreadIndex,
  });

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
