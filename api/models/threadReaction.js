// @flow
import { db } from './db';
import {
  sendThreadReactionNotificationQueue,
  processReputationEventQueue,
} from 'shared/bull/queues';
import type { DBThreadReaction } from 'shared/types';
import { events } from 'shared/analytics';
import { trackQueue } from 'shared/bull/queues';

type ReactionType = 'like';

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

type ThreadReactionInput = {
  threadId: string,
  type: ReactionType,
};

// prettier-ignore
export const addThreadReaction = (input: ThreadReactionInput, userId: string): Promise<DBThreadReaction> => {
  return db
    .table('threadReactions')
    .getAll(input.threadId, { index: 'threadId' })
    .filter({ userId })
    .run()
    .then(async results => {
      // if the reaction already exists in the db, it was previously deleted
      // just remove the deletedAt field
      if (results && results.length > 0) {
        const thisReaction = results[0];

        trackQueue.add({
          userId,
          event: events.THREAD_REACTION_CREATED,
          context: {
            threadReactionId: thisReaction.id,
          },
        });

        sendThreadReactionNotificationQueue.add({ threadReaction: thisReaction, userId });

        processReputationEventQueue.add({
          userId,
          type: 'thread reaction created',
          entityId: thisReaction.threadId,
        });

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
        .then(threadReaction => {
          trackQueue.add({
            userId,
            event: events.THREAD_REACTION_CREATED,
            context: { threadReactionId: threadReaction.id },
          });

          sendThreadReactionNotificationQueue.add({ threadReaction, userId });

          processReputationEventQueue.add({
            userId,
            type: 'thread reaction created',
            entityId: threadReaction.threadId,
          });

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
    .then(results => {
      // no reaction exists to be removed
      if (!results || results.length === 0) return null;

      const threadReaction = results[0];

      trackQueue.add({
        userId,
        event: events.THREAD_REACTION_DELETED,
        context: { threadReactionId: threadReaction.id },
      });

      processReputationEventQueue.add({
        userId,
        type: 'thread reaction deleted',
        entityId: threadReaction.threadId,
      });

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
