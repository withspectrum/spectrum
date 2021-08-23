// @flow
import { db } from 'shared/db';
import type { DBThreadReaction } from 'shared/types';

// prettier-ignore
export const getThreadReactions = (threadIds: Array<string>): Promise<Array<DBThreadReaction>> => {
  const distinctMessageIds = threadIds.filter((x, i, a) => a.indexOf(x) == i);
  return db
    .table('threadReactions')
    .getAll(...distinctMessageIds, { index: 'threadId' })
    .filter(row => row.hasFields('deletedAt').not())
    .group('threadId')
    .run();
};

export const hasReactedToThread = (
  userId: string,
  threadId: string
): Promise<boolean> => {
  return db
    .table('threadReactions')
    .getAll([userId, threadId], { index: 'userIdAndThreadId' })
    .filter(row => row.hasFields('deletedAt').not())
    .count()
    .eq(1)
    .run();
};
