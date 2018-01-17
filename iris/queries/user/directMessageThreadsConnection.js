// @flow
import type { GraphQLContext } from '../../';
import type { PaginationOptions } from '../../utils/paginate-arrays';
import { encode, decode } from '../../utils/base64';
import { getDirectMessageThreadsByUser } from '../../models/directMessageThread';

export default async (
  _: any,
  { first = 15, after }: PaginationOptions,
  { user }: GraphQLContext
) => {
  const cursor = decode(after);
  // Get the index from the encoded cursor, asdf234gsdf-2 => ["-2", "2"]
  const lastDigits = cursor.match(/-(\d+)$/);
  const lastThreadIndex =
    lastDigits && lastDigits.length > 0 && parseInt(lastDigits[1], 10);

  const threads = await getDirectMessageThreadsByUser(user.id, {
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
