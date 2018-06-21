// @flow
import { db } from './db';
import {
  sendReactionNotificationQueue,
  sendThreadReactionNotificationQueue,
  processReputationEventQueue,
} from 'shared/bull/queues';
import type { DBReaction, DBThreadReaction } from 'shared/types';
import { events } from 'shared/analytics';
import { trackQueue } from 'shared/bull/queues';

type ReactionType = 'like';

export type ReactionInput = {
  messageId: string,
  type: ReactionType,
};

// prettier-ignore
export const getReactions = (messageIds: Array<string>): Promise<Array<DBReaction>> => {
  const distinctMessageIds = messageIds.filter((x, i, a) => a.indexOf(x) == i);
  return db
    .table('reactions')
    .getAll(...distinctMessageIds, { index: 'messageId' })
    .filter(row => row.hasFields('deletedAt').not())
    .group('messageId')
    .run();
};

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

export const getReaction = (reactionId: string): Promise<DBReaction> => {
  return db
    .table('reactions')
    .get(reactionId)
    .run();
};

// prettier-ignore
export const getReactionsByIds = (reactionIds: Array<string>): Promise<Array<DBReaction>> => {
  return db
    .table('reactions')
    .getAll(...reactionIds)
    .run();
};

type ThreadReactionInput = {
  threadId: string,
  type: ReactionType,
};

export const addThreadReaction = (
  reaction: ThreadReactionInput,
  userId: string
): Promise<DBThreadReaction> => {
  return db
    .table('threadReactions')
    .getAll(reaction.threadId, { index: 'threadId' })
    .filter({ userId })
    .run()
    .then(async results => {
      // if the reaction already exists in the db, it was previously deleted
      // just remove the deletedAt field
      if (results && results.length > 0) {
        const thisReaction = results[0];

        return db
          .table('threadReactions')
          .get(thisReaction.id)
          .update({
            deletedAt: db.literal(),
          })
          .run()
          .then(() => {
            trackQueue.add({
              userId,
              event: events.THREAD_REACTION_CREATED,
              context: {
                threadReactionId: thisReaction.id,
              },
            });

            processReputationEventQueue.add({
              userId,
              type: 'thread reaction created',
              entityId: thisReaction.threadId,
            });

            return;
          });
      }

      return db
        .table('threadReactions')
        .insert(
          {
            ...reaction,
            userId,
            createdAt: Date.now(),
          },
          { returnChanges: true }
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
            entityId: reaction.threadId,
          });

          return reaction;
        });
    });
};

export const removeThreadReaction = (
  threadId: string,
  userId: string
): Promise<DBReaction> => {
  return db
    .table('threadReactions')
    .getAll(threadId, { index: 'threadId' })
    .filter({ userId })
    .run()
    .then(results => {
      // no reaction exists to be removed
      if (!results || results.length === 0) return;

      const thisReaction = results[0];

      return db
        .table('threadReactions')
        .get(thisReaction.id)
        .update({
          deletedAt: new Date(),
        })
        .run()
        .then(() => {
          trackQueue.add({
            userId,
            event: events.THREAD_REACTION_DELETED,
            context: { threadReactionId: thisReaction.id },
          });

          processReputationEventQueue.add({
            userId,
            type: 'thread reaction deleted',
            entityId: thisReaction.threadId,
          });
        });
    });
};

// prettier-ignore
export const toggleReaction = (reaction: ReactionInput, userId: string): Promise<DBReaction> => {
  return db
    .table('reactions')
    .getAll(reaction.messageId, { index: 'messageId' })
    .filter({ userId })
    .run()
    .then(async result => {
      // user has already reacted
      if (result && result.length > 0) {
        const thisReaction = result[0];

        // user is re-reacting
        if (thisReaction.deletedAt) {
          trackQueue.add({
            userId,
            event: events.REACTION_CREATED,
            context: {
              reactionId: thisReaction.id,
            },
          });

          processReputationEventQueue.add({
            userId,
            type: 'reaction created',
            entityId: thisReaction.messageId,
          });

          return db
            .table('reactions')
            .get(thisReaction.id)
            .update({
              deletedAt: db.literal(),
            })
            .run();
        }

        // deleting reaction
        trackQueue.add({
          userId,
          event: events.REACTION_DELETED,
          context: {
            reactionId: thisReaction.id,
          },
        });

        processReputationEventQueue.add({
          userId,
          type: 'reaction deleted',
          entityId: thisReaction.messageId,
        });

        return db
          .table('reactions')
          .get(thisReaction.id)
          .update({
            deletedAt: new Date(),
          })
          .run();
      }

      // user has not reacted yet
      return db
        .table('reactions')
        .insert(
          {
            ...reaction,
            userId,
            timestamp: Date.now(),
          },
          { returnChanges: true }
        )
        .run()
        .then(result => result.changes[0].new_val)
        .then(reaction => {
          trackQueue.add({
            userId,
            event: events.REACTION_CREATED,
            context: { reactionId: reaction.id },
          });

          sendReactionNotificationQueue.add({ reaction, userId });

          processReputationEventQueue.add({
            userId,
            type: 'reaction created',
            entityId: reaction.messageId,
          });

          return reaction;
        });
    })
    .then(() => {
      // return the message object itself in order to more easily update the UI with the apollo store
      return db
        .table('messages')
        .get(reaction.messageId)
        .run();
    });
};
