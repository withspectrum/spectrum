'use strict';

exports.up = function(r, conn) {
  return r
    .tableCreate('webPushSubscriptions')
    .run(conn)
    .catch(err => {
      throw new Error(err);
    })
    .then(() => r.table('webPushSubscriptions').indexCreate('userId').run(conn))
    .then(() =>
      r.table('webPushSubscriptions').indexCreate('endpoint').run(conn)
    );
};

exports.down = function(r, conn) {
  return r.tableDrop('webPushSubscriptions').run(conn).catch(err => {
    throw new Error(err);
  });
};
