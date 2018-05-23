// @flow
import type { DBUser } from 'shared/types';
import { db } from './db';

export const getUserById = (userId: string): Promise<DBUser> => {
  return db
    .table('users')
    .get(userId)
    .run();
};
