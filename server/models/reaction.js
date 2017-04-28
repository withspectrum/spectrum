// @flow
import { db } from './db';

type ReactionType = 'like';

export type ReactionInput = {
  message: string,
  user: string,
  type: ReactionType,
};

export const getReactions = (message: string) => {
  return db.table('reactions').filter({ message }).run();
};

export const getReaction = (id: string) => {
  return db.table('reactions').get(id).run();
};

export const toggleReaction = (reaction: ReactionInput) => {
  return db
    .table('reactions')
    .filter({
      message: reaction.message,
      user: reaction.user,
    })
    .run()
    .then(result => {
      if (result.length > 0) {
        const existing = result[0];
        return db
          .table('reactions')
          .delete(existing.id)
          .then(({ deleted }) => (deleted > 0 ? true : false));
      } else {
        return db
          .table('reactions')
          .insert({
            ...reaction,
            timestamp: Date.now(),
          })
          .then(({ inserted }) => (inserted > 0 ? true : false));
      }
    });
};
