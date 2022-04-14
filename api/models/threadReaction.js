// @flow
import { db } from 'shared/db';
import {
  sendThreadReactionNotificationQueue,
  processReputationEventQueue,
} from 'shared/bull/queues';
import type { DBThreadReaction } from 'shared/types';
import { incrementReactionCount, decrementReactionCount } from './thread';
import { getThreadById } from './thread';

type ThreadReactionType = 'like';

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

type ThreadReactionInput = {
  threadId: string,
  type: ThreadReactionType,
};

// prettier-ignore
export const addThreadReaction = (input: ThreadReactionInput, userId: string): Promise<DBThreadReaction> => {
  return db
    .table('threadReactions')
    .getAll(input.threadId, { index: 'threadId' })
    .filter({ userId })
    .run()
    .then(async results => {
      const thread = await getThreadById(input.threadId)
      // if the reaction already exists in the db, it was previously deleted
      // just remove the deletedAt field
      if (results && results.length > 0) {
        const thisReaction = results[0];

        const sendReactionNotification = thread && (thread.creatorId !== userId)
          ? sendThreadReactionNotificationQueue.add({ threadReaction: thisReaction, userId })
          : null

        await Promise.all([
          sendReactionNotification,
          processReputationEventQueue.add({
            userId,
            type: 'thread reaction created',
            entityId: thisReaction.threadId,
          }),
          incrementReactionCount(thisReaction.threadId)
        ])

        return db
          .table('threadReactions')
          .get(thisReaction.id)
          .update({
            deletedAt: db.literal(),
          }, { returnChanges: 'always' })
          .run()
          .then(result => result.changes[0].new_val || result.changes[0].new_val)
      }

      return db
        .table('threadReactions')
        .insert(
          {
            ...input,
            userId,
            createdAt: Date.now(),
          },
          { returnChanges: 'always' }
        )
        .run()
        .then(result => result.changes[0].new_val)
        .then(async threadReaction => {
          const sendReactionNotification = thread && (thread.creatorId !== userId)
            ? sendThreadReactionNotificationQueue.add({ threadReaction, userId })
            : null

          await Promise.all([
            processReputationEventQueue.add({
              userId,
              type: 'thread reaction created',
              entityId: threadReaction.threadId,
            }),
            sendReactionNotification,
            incrementReactionCount(threadReaction.threadId)
          ])

          return threadReaction;
        });
    });
};

// prettier-ignore
export const removeThreadReaction = (threadId: string, userId: string): Promise<?DBThreadReaction> => {
  return db
    .table('threadReactions')
    .getAll(threadId, { index: 'threadId' })
    .filter({ userId })
    .run()
    .then(async results => {
      // no reaction exists to be removed
      if (!results || results.length === 0) return null;

      const threadReaction = results[0];

      await Promise.all([
        processReputationEventQueue.add({
          userId,
          type: 'thread reaction deleted',
          entityId: threadReaction.threadId,
        }),
        decrementReactionCount(threadId)
      ])

      return db
        .table('threadReactions')
        .get(threadReaction.id)
        .update({
          deletedAt: new Date(),
        }, { returnChanges: 'always' })
        .run()
        .then(result => result.changes[0].new_val || result.changes[0].new_val)
    });
};
