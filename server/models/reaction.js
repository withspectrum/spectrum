// @flow
import { db } from './db';

type ReactionType = 'like';

export type ReactionInput = {
  messageId: string,
  type: ReactionType,
};

export const getReactions = (messageId: string): Promise<Array<Object>> => {
  return db.table('reactions').getAll(messageId, { index: 'messageId' }).run();
};

export const getReaction = (reactionId: string): Promise<Object> => {
  return db.table('reactions').get(reactionId).run();
};

export const toggleReaction = (
  reaction: ReactionInput,
  userId: string
): Promise<Object> => {
  return db
    .table('reactions')
    .filter({
      messageId: reaction.messageId,
      userId,
    })
    .run()
    .then(result => {
      if (result.length > 0) {
        const existing = result[0];
        return db
          .table('reactions')
          .get(existing.id)
          .delete({ returnChanges: true })
          .run()
          .then(
            ({ deleted, changes }) => (deleted > 0 ? changes[0].old_val : false)
          );
      } else {
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
          .then(
            ({ inserted, changes }) =>
              (inserted > 0 ? changes[0].new_val : false)
          );
      }
    });
};
