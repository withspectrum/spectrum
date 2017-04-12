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

module.exports = {
  getNotification,
  markNotificationsRead,
};
