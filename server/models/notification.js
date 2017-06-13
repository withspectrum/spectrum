// @flow
const { db } = require('./db');
import paginate from '../utils/paginate-arrays';
const { listenToNewDocumentsIn } = require('./utils');
import type { PaginationOptions } from '../utils/paginate-arrays';
import { encode, decode } from '../utils/base64';
import { NEW_DOCUMENTS } from './utils';

const getNotificationsByUser = (userId: string) => {
  return db
    .table('usersNotifications')
    .getAll(userId, { index: 'userId' })
    .eqJoin('notificationId', db.table('notifications'))
    .without({
      left: ['notificationId', 'userId', 'createdAt', 'id'],
    })
    .zip()
    .orderBy(db.desc('modifiedAt'))
    .run();
};

const hasChanged = (field: string) =>
  db.row('old_val')(field).ne(db.row('new_val')(field));

const SEEN_STATUS_CHANGED = hasChanged('isSeen');
const READ_STATUS_CHANGED = hasChanged('isRead');
const STATUS_CHANGED = SEEN_STATUS_CHANGED.or(READ_STATUS_CHANGED);

const listenToNewNotifications = (cb: Function): Function => {
  return db
    .table('usersNotifications')
    .changes({
      includeInitial: false,
    })
    .filter(NEW_DOCUMENTS.or(STATUS_CHANGED))('new_val')
    .eqJoin('notificationId', db.table('notifications'))
    .without({
      left: ['notificationId', 'createdAt', 'id'],
    })
    .zip()
    .run({ cursor: true }, (err, cursor) => {
      if (err) throw err;
      cursor.each((err, data) => {
        if (err) throw err;
        // Call the passed callback with the notification
        cb(data);
      });
    });
};

module.exports = {
  getNotificationsByUser,
  listenToNewNotifications,
};
