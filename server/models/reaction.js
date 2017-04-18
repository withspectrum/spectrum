// @flow
import { db } from './db';

export const getReactions = (message: string) => {
  return db.table('reactions').filter({ message }).run();
};

export const getReaction = (id: string) => {
  return db.table('reactions').get(id).run();
};
