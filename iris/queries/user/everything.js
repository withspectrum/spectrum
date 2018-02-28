// @flow
import type { GraphQLContext } from '../../';
import type { PaginationOptions } from '../../utils/paginate-arrays';
import { encode, decode } from '../../utils/base64';
import { getEverything } from '../../models/user';

export default (
  _: any,
  { first, after }: PaginationOptions,
  { user, loaders }: GraphQLContext
) => {
  const cursor = decode(after);
  // Get the index from the encoded cursor, asdf234gsdf-2 => ["-2", "2"]
  const lastDigits = cursor.match(/-(\d+)$/);
  const lastThreadIndex =
    lastDigits && lastDigits.length > 0 && parseInt(lastDigits[1], 10);
  return loaders.userEverything
    .load([
      user.id,
      // $FlowIssue
      {
        first,
        after: lastThreadIndex,
      },
    ])
    .then(({ result }) => ({
      pageInfo: {
        hasNextPage: result && result.length >= first,
      },
      edges: result
        ? result.map((thread, index) => ({
            cursor: encode(`${thread.id}-${lastThreadIndex + index + 1}`),
            node: thread,
          }))
        : [],
    }));
};
