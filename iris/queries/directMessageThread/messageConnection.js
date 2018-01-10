// @flow
import type { PaginationOptions } from '../../utils/paginate-arrays';
import type { GraphQLContext } from '../../';
import { canViewDMThread } from './utils';
import { encode, decode } from '../../utils/base64';
import { getMessages } from '../../models/message';

export default async (
  { id }: { id: string },
  { first = 30, after }: PaginationOptions,
  { user, loaders }: GraphQLContext
) => {
  if (!user || !user.id) return null;

  const canViewThread = await canViewDMThread(id, user.id, { loaders });
  if (!canViewThread) return null;

  const cursor = decode(after);
  // Get the index from the encoded cursor, asdf234gsdf-2 => ["-2", "2"]
  const lastDigits = cursor.match(/-(\d+)$/);
  const lastMessageIndex =
    lastDigits && lastDigits.length > 0 && parseInt(lastDigits[1], 10);
  // $FlowFixMe
  const messages = await getMessages(id, {
    first,
    after: lastMessageIndex,
    reverse: true,
  });

  return {
    pageInfo: {
      hasNextPage: messages && messages.length >= first,
    },
    edges: messages.map((message, index) => ({
      cursor: encode(`${message.id}-${lastMessageIndex + index + 1}`),
      node: message,
    })),
  };
};
