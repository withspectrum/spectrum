'use strict';

exports.up = function(r, conn) {
  return r
    .tableCreate('webPushSubscriptions', { primaryKey: 'endpoint' })
    .run(conn)
    .catch(err => {
      throw new Error(err);
    });
};

exports.down = function(r, conn) {
  return r.tableDrop('webPushSubscriptions').run(conn).catch(err => {
    throw new Error(err);
  });
};
