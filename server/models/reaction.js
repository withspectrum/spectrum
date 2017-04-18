// @flow
import { db } from './db';

export const getReactions = message => {
  return db.table('reactions').filter({ message }).run();
};
