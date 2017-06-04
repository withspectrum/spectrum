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
    .getAll(reaction.messageId, { index: 'messageId' })
    .filter({ userId })
    .run()
    .then(result => {
      // this user has already reacted to the message, remove the reaction
      if (result.length > 0) {
        const existing = result[0];
        return db.table('reactions').get(existing.id).delete().run();
      } else {
        return db
          .table('reactions')
          .insert({
            ...reaction,
            userId,
            timestamp: Date.now(),
          })
          .run();
      }
    })
    .then(() => {
      // return the message object itself
      return db.table('messages').get(reaction.messageId).run();
    });
};
