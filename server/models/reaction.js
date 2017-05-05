// @flow
import { db } from './db';

type ReactionType = 'like';

export type ReactionInput = {
  message: string,
  type: ReactionType,
};

export const getReactions = (message: string) => {
  return db.table('reactions').filter({ message }).run();
};

export const getReaction = (id: string) => {
  return db.table('reactions').get(id).run();
};

export const toggleReaction = (reaction: ReactionInput, uid: string) => {
  return db
    .table('reactions')
    .filter({
      message: reaction.message,
      user: uid,
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
              user: uid,
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
