// @flow
const { db } = require('./db');
import paginate from '../utils/paginate-arrays';
const { listenToNewDocumentsIn } = require('./utils');
import type { PaginationOptions } from '../utils/paginate-arrays';
import { encode, decode } from '../utils/base64';
import { NEW_DOCUMENTS } from './utils';

const getNotificationsByUser = (userId: string, { first, after }) => {
  return db
    .table('usersNotifications')
    .between(
      [userId, db.minval],
      [userId, after ? new Date(after) : db.maxval],
      {
        index: 'userIdAndEntityAddedAt',
        leftBound: 'open',
        rightBound: 'open',
      }
    )
    .orderBy({ index: db.desc('userIdAndEntityAddedAt') })
    .limit(10)
    .eqJoin('notificationId', db.table('notifications'))
    .without({
      left: ['notificationId', 'userId', 'createdAt', 'id'],
    })
    .zip()
    .run();
};

const hasChanged = (field: string) =>
  db.row('old_val')(field).ne(db.row('new_val')(field));

const MODIFIED_AT_CHANGED = hasChanged('entityAddedAt');

const listenToNewNotifications = (cb: Function): Function => {
  return db
    .table('usersNotifications')
    .changes({
      includeInitial: false,
    })
    .filter(NEW_DOCUMENTS.or(MODIFIED_AT_CHANGED))('new_val')
    .eqJoin('notificationId', db.table('notifications'))
    .without({
      left: ['notificationId', 'createdAt', 'id', 'entityAddedAt'],
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
