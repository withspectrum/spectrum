// @flow
import { db } from 'shared/db';
import {
  sendReactionNotificationQueue,
  processReputationEventQueue,
} from 'shared/bull/queues';
import type { DBReaction } from 'shared/types';

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
