// @flow
const { db } = require('./db');
import { NEW_DOCUMENTS } from './utils';

export const getNotificationsByUser = (
  userId: string,
  { after }: { after: Date }
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
    .limit(10)
    .eqJoin('notificationId', db.table('notifications'))
    .without({
      left: ['notificationId', 'userId', 'createdAt', 'id'],
    })
    .zip()
    .run();
};

export const getUnreadDirectMessageNotifications = (
  userId: string
): Promise<Array<Object>> => {
  return db
    .table('usersNotifications')
    .between([userId, db.minval], [userId, db.maxval], {
      index: 'userIdAndEntityAddedAt',
      leftBound: 'open',
      rightBound: 'open',
    })
    .orderBy({ index: db.desc('userIdAndEntityAddedAt') })
    .eqJoin('notificationId', db.table('notifications'))
    .without({
      left: ['notificationId', 'userId', 'createdAt', 'id'],
    })
    .zip()
    .filter(row =>
      row('isSeen')
        .eq(false)
        .and(row('context')('type').eq('DIRECT_MESSAGE_THREAD'))
    )
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
    .run({ cursor: true }, (err, cursor) => {
      if (err) throw err;
      cursor.each((err, data) => {
        if (err) throw err;
        // Call the passed callback with the notification
        cb(data);
      });
    });
};
