// @flow
import type { DBCommunity } from 'shared/types';
import type { GraphQLContext } from '../../';
import { encode, decode } from '../../utils/base64';
import {
  getChannelsByUserAndCommunity,
  getPublicChannelsByCommunity,
} from '../../models/channel';
import { getThreadsByChannels } from '../../models/thread';
import { canViewCommunity } from '../../utils/permissions';

export type CommunityThreadConnectionPaginationOptions = {
  after: string,
  first: number,
  sort: 'latest' | 'trending',
};

// prettier-ignore
export default async (root: DBCommunity, args: CommunityThreadConnectionPaginationOptions, ctx: GraphQLContext) => {
  const { first = 10, after, sort = 'latest' } = args
  const { user, loaders } = ctx
  const { id } = root

  if (!await canViewCommunity(user, id, loaders)) {
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
    lastDigits && lastDigits.length > 0 && parseInt(lastDigits[1], 10) || 0;
  const currentUser = user;

  // if the user is signed in, only return stories for the channels
  // the user is a member of -> this will ensure that they don't see
  // stories in private channels that they aren't a member of.
  // if the user is *not* signed in or not a member, only get threads
  // from public channels within the community
  let channels;
  let isMember = false;
  if (user) {
    const permissions = await loaders.userPermissionsInCommunity.load([
      user.id,
      id,
    ]);
    isMember = permissions && permissions.isMember;
  }
  if (user && isMember) {
    channels = await getChannelsByUserAndCommunity(id, currentUser.id);
  } else {
    channels = await getPublicChannelsByCommunity(id);
  }

  const threads = await getThreadsByChannels(channels, {
    first,
    after: lastThreadIndex,
    sort,
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
