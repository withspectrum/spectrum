// @flow
import { db } from './db';

export const getUser = (id: string) => {
  return db
    .table('users')
    .get(id)
    .run();
};
