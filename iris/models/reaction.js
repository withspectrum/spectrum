// @flow
import { db } from './db';
import { addQueue } from '../utils/workerQueue';

type ReactionType = 'like';

export type ReactionInput = {
  messageId: string,
  type: ReactionType,
};

export const getReactions = (messageId: string): Promise<Array<Object>> => {
  return db
    .table('reactions')
    .getAll(messageId, { index: 'messageId' })
    .run();
};

export const getReaction = (reactionId: string): Promise<Object> => {
  return db
    .table('reactions')
    .get(reactionId)
    .run();
};

export const toggleReaction = (
  reaction: ReactionInput,
  userId: string
): Promise<Object> => {
  return db
    .table('reactions')
    .getAll(reaction.messageId, { index: 'messageId' })
    .filter({ userId })
    .run()
    .then(result => {
      // this user has already reacted to the message, remove the reaction
      if (result.length > 0) {
        const existing = result[0];

        addQueue('process reputation event', {
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
        addQueue('process reputation event', {
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
            addQueue('reaction notification', { reaction, userId });

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
