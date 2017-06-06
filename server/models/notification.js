// @flow
const { db } = require('./db');
import paginate from '../utils/paginate-arrays';
const { listenToNewDocumentsIn } = require('./utils');
import type { PaginationOptions } from '../utils/paginate-arrays';
import { encode, decode } from '../utils/base64';

const getNotificationsByUser = (
  userId: string,
  { first, after }: PaginationOptions
) => {
  const cursor = decode(after);
  return db
    .table('usersNotifications')
    .getAll(userId, { index: 'userId' })
    .eqJoin('notificationId', db.table('notifications'))
    .without({
      left: ['notificationId', 'userId', 'createdAt', 'id'],
    })
    .zip()
    .run();
};

const listenToNewNotifications = (cb: Function): Function => {
  return listenToNewDocumentsIn('notifications', cb);
};

module.exports = {
  getNotificationsByUser,
  listenToNewNotifications,
};
