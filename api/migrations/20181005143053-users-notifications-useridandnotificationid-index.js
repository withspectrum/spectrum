exports.up = function(r, conn) {
  return r
    .table('usersNotifications')
    .indexCreate('userIdAndNotificationId', [
      r.row('userId'),
      r.row('notificationId'),
    ])
    .run(conn);
};

exports.down = function(r, conn) {
  return r
    .table('usersNotifications')
    .indexDrop('userIdAndNotificationId')
    .run(conn);
};
