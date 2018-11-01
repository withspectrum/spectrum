// @flow
import { db } from 'shared/db';

export const destroySession = (id: string) => {
  return db
    .table('sessions')
    .get(id)
    .delete()
    .run();
};
