// @flow
const { db } = require('./db');
import { NEW_DOCUMENTS } from './utils';

export const getNotificationsByUser = (
  userId: string,
  { first, after }: { first: number, after: Date }
) => {
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
    .eqJoin('notificationId', db.table('notifications'))
    .without({
      left: ['notificationId', 'userId', 'createdAt', 'id'],
    })
    .zip()
    .filter(row => row('context')('type').ne('DIRECT_MESSAGE_THREAD'))
    .limit(first)
    .run();
};

export const getUnreadDirectMessageNotifications = (
  userId: string,
  { first, after }: { first: number, after: Date }
): Promise<Array<Object>> => {
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
    .filter({ isSeen: false })
    .eqJoin('notificationId', db.table('notifications'))
    .without({
      left: ['notificationId', 'userId', 'createdAt', 'id'],
    })
    .zip()
    .filter(row => row('context')('type').eq('DIRECT_MESSAGE_THREAD'))
    .limit(first)
    .run();
};

const hasChanged = (field: string) =>
  db.row('old_val')(field).ne(db.row('new_val')(field));

const MODIFIED_AT_CHANGED = hasChanged('entityAddedAt');

export const listenToNewNotifications = (cb: Function): Function => {
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
    .filter(row => row('context')('type').ne('DIRECT_MESSAGE_THREAD'))
    .run({ cursor: true }, (err, cursor) => {
      if (err) throw err;
      cursor.each((err, data) => {
        if (err) throw err;
        // Call the passed callback with the notification
        cb(data);
      });
    });
};

export const listenToNewDirectMessageNotifications = (
  cb: Function
): Function => {
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
    .filter(row => row('context')('type').eq('DIRECT_MESSAGE_THREAD'))
    .run({ cursor: true }, (err, cursor) => {
      if (err) throw err;
      cursor.each((err, data) => {
        if (err) throw err;
        // Call the passed callback with the notification
        cb(data);
      });
    });
};
