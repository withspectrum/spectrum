/**
 * Getting notifications from the database
 */

const { db } = require('./db');

const getNotification = id => {
  return db.table('notifications').get(id).run();
};

const markNotificationsRead = story => {
  return db
    .table('notifications')
    .filter({ story })
    .update({
      read: true,
    })
    .run();
};

const storeNotification = notification => {
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

const getNotificationsByUser = uid => {
  return db.table('notifications').getAll(uid, { index: 'user' }).run();
};

module.exports = {
  getNotification,
  markNotificationsRead,
  getNotificationsByUser,
  storeNotification,
};
