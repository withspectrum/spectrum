// @flow
const { db } = require('shared/db');
import type { DBUsersNotifications } from 'shared/types';

// prettier-ignore
export const getSeenUsersNotifications = (after: number, limit: number): Promise<Array<DBUsersNotifications>> => {
  return db
    .table('usersNotifications')
    .skip(after)
    .limit(limit)
    .run()
};

// prettier-ignore
export const deleteUsersNotifications = (arr: Array<string>): Promise<boolean> => {
  return db
    .table('usersNotifications')
    .getAll(...arr)
    .delete()
    .run()
    .then(() => true);
};
