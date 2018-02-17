// @flow
import { db } from './db';
import {
  sendReactionNotificationQueue,
  processReputationEventQueue,
} from 'shared/bull/queues';

type ReactionType = 'like';

type DBReaction = {
  id: string,
  messageId: string,
  timestamp: Date,
  type: ReactionType,
  userId: string,
};

export type ReactionInput = {
  messageId: string,
  type: ReactionType,
};

export const getReactions = (
  messageIds: Array<string>
): Promise<Array<DBReaction>> => {
  const distinctMessageIds = messageIds.filter((x, i, a) => a.indexOf(x) == i);
  return db
    .table('reactions')
    .getAll(...distinctMessageIds, { index: 'messageId' })
    .group('messageId')
    .run();
};

export const getReaction = (reactionId: string): Promise<DBReaction> => {
  return db
    .table('reactions')
    .get(reactionId)
    .run();
};

export const toggleReaction = (
  reaction: ReactionInput,
  userId: string
): Promise<DBReaction> => {
  return db
    .table('reactions')
    .getAll(reaction.messageId, { index: 'messageId' })
    .filter({ userId })
    .run()
    .then(result => {
      // this user has already reacted to the message, remove the reaction
      if (result.length > 0) {
        const existing = result[0];

        processReputationEventQueue.add({
          userId,
          type: 'reaction deleted',
          entityId: existing.messageId,
        });

        return db
          .table('reactions')
          .get(existing.id)
          .delete()
          .run();
      } else {
        processReputationEventQueue.add({
          userId,
          type: 'reaction created',
          entityId: reaction.messageId,
        });

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

            return reaction;
          });
      }
    })
    .then(() => {
      // return the message object itself in order to more easily update the UI with the apollo store
      return db
        .table('messages')
        .get(reaction.messageId)
        .run();
    });
};
