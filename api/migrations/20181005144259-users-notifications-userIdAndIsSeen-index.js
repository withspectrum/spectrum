exports.up = function(r, conn) {
  return r
    .table('usersNotifications')
    .indexCreate('userIdAndIsSeen', [r.row('userId'), r.row('isSeen')])
    .run(conn);
};

exports.down = function(r, conn) {
  return r
    .table('usersNotifications')
    .indexDrop('userIdAndIsSeen')
    .run(conn);
};
