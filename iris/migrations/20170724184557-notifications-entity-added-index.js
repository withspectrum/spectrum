'use strict';

exports.up = function(r, conn) {
  return Promise.all([
    r
      .table('usersNotifications')
      .indexCreate('userIdAndEntityAddedAt', [
        r.row('userId'),
        r.row('entityAddedAt'),
      ])
      .run(conn),
  ]).catch(err => {
    console.log(err);
    throw err;
  });
};

exports.down = function(r, conn) {
  return Promise.resolve();
};
