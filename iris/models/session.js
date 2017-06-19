// @flow
import { db } from './db';

export const destroySession = (id: string) => {
  return db.table('sessions').get(id).delete().run();
};
