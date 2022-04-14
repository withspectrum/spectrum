// @flow
import type { GraphQLContext } from '../../';
import type { DBUser } from 'shared/types';
import type { PaginationOptions } from '../../utils/paginate-arrays';
import { encode, decode } from '../../utils/base64';
const {
  getViewableThreadsByUser,
  getPublicThreadsByUser,
  getPublicParticipantThreadsByUser,
  getViewableParticipantThreadsByUser,
} = require('../../models/thread');

export default (
  { id }: DBUser,
  {
    first,
    after,
    kind,
  }: { ...PaginationOptions, kind: 'creator' | 'participant' },
  { user }: GraphQLContext
) => {
  const currentUser = user;
  const cursor = decode(after);
  // Get the index from the encoded cursor, asdf234gsdf-2 => ["-2", "2"]
  const lastDigits = cursor.match(/-(\d+)$/);
  const lastThreadIndex =
    lastDigits && lastDigits.length > 0 && parseInt(lastDigits[1], 10);
  // if a logged in user is viewing the profile, handle logic to get viewable threads

  let getThreads;
  if (currentUser) {
    getThreads =
      kind === 'creator'
        ? // $FlowIssue
          getViewableThreadsByUser(id, currentUser.id, {
            first,
            after: lastThreadIndex,
          })
        : // $FlowIssue
          getViewableParticipantThreadsByUser(id, currentUser.id, {
            first,
            after: lastThreadIndex,
          });
  } else {
    getThreads =
      kind === 'creator'
        ? // $FlowIssue
          getPublicThreadsByUser(id, { first, after: lastThreadIndex })
        : // $FlowIssue
          getPublicParticipantThreadsByUser(id, {
            first,
            after: lastThreadIndex,
          });
  }

  return getThreads.then(result => ({
    pageInfo: {
      // $FlowFixMe => super weird
      hasNextPage: result && result.length >= first,
    },
    edges: result.map((thread, index) => ({
      cursor: encode(`${thread.id}-${lastThreadIndex + index + 1}`),
      node: thread,
    })),
  }));
};
