// @flow
/**
 * Getting notifications from the database
 */

const { db } = require('./db');
import paginate from '../utils/paginate-arrays';
import type { PaginationOptions } from '../utils/paginate-arrays';
import { encode, decode } from '../utils/base64';

const getNotification = (id: string) => {
  return db.table('notifications').get(id).run();
};

const markNotificationsRead = (story: string) => {
  return db
    .table('notifications')
    .filter({ story })
    .update({
      read: true,
    })
    .run();
};

// TODO: figure out what the notification input should look like
const storeNotification = (notification: any) => {
  return db
    .table('notifications')
    .insert(
      Object.assign({}, notification, {
        createdAt: new Date(),
      }),
      { returnChanges: true }
    )
    .run()
    .then(result => result.changes[0].new_val);
};

const getNotificationsByUser = (
  uid: string,
  { first, after }: PaginationOptions
) => {
  const cursor = decode(after);
  return (
    db
      .table('notifications')
      .getAll(uid, { index: 'user' })
      .orderBy('createdAt')
      .distinct()
      .run()
      // TODO: Move this pagination to the query rather than fetching all notifications
      .then(notifications =>
        paginate(
          notifications,
          { first, after: cursor },
          notification => notification.id === cursor
        )
      )
      .then(result => ({
        pageInfo: {
          hasNextPage: result.hasMoreItems,
        },
        edges: result.list.map(notification => ({
          cursor: encode(notification.id),
          node: notification,
        })),
      }))
  );
};

module.exports = {
  getNotification,
  markNotificationsRead,
  getNotificationsByUser,
  storeNotification,
};
