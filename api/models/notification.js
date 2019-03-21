// @flow
const { db } = require('shared/db');
import { NEW_DOCUMENTS } from './utils';
import { createChangefeed } from 'shared/changefeed-utils';
import type { DBNotification } from 'shared/types';

// prettier-ignore
export const getNotification = (notificationId: string): Promise<DBNotification> => {
  return db
    .table('notifications')
    .get(notificationId)
    .run();
};

type InputType = { first: number, after: Date };
export const getNotificationsByUser = (userId: string, input: InputType) => {
  const { first, after } = input;
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

// prettier-ignore
export const getUnreadDirectMessageNotifications = (userId: string, input: InputType,): Promise<Array<Object>> => {
  const { first, after } = input

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
  db
    .row('old_val')(field)
    .ne(db.row('new_val')(field));

const ENTITY_ADDED = hasChanged('entityAddedAt');

const getNewNotificationsChangefeed = () =>
  db
    .table('usersNotifications')
    .changes({
      includeInitial: false,
    })('new_val')
    .eqJoin('notificationId', db.table('notifications'))
    .without({
      left: ['notificationId', 'createdAt', 'id', 'entityAddedAt'],
    })
    .zip()
    .filter(row => row('context')('type').ne('DIRECT_MESSAGE_THREAD'))
    .run();

export const listenToNewNotifications = (cb: Function): Function => {
  return createChangefeed(
    getNewNotificationsChangefeed,
    cb,
    'listenToNewNotifications'
  );
};

const getNewDirectMessageNotificationsChangefeed = () =>
  db
    .table('usersNotifications')
    .changes({
      includeInitial: false,
    })
    .filter(NEW_DOCUMENTS.or(ENTITY_ADDED))('new_val')
    .eqJoin('notificationId', db.table('notifications'))
    .without({
      left: ['notificationId', 'createdAt', 'id', 'entityAddedAt'],
    })
    .zip()
    .filter(row => row('context')('type').eq('DIRECT_MESSAGE_THREAD'))
    .run();

export const listenToNewDirectMessageNotifications = (cb: Function) => {
  return createChangefeed(
    getNewDirectMessageNotificationsChangefeed,
    cb,
    'listenToNewDirectMessageNotifications'
  );
};
