exports.up = function(r, conn) {
  return r
    .tableCreate('expoPushSubscriptions')
    .run(conn)
    .then(() =>
      r
        .table('expoPushSubscriptions')
        .indexCreate('userId')
        .run(conn)
    )
    .then(() =>
      r
        .table('expoPushSubscriptions')
        .indexCreate('token')
        .run(conn)
    )
    .catch(err => {
      throw new Error(err);
    });
};

exports.down = function(r, conn) {
  return r
    .tableDrop('expoPushSubscriptions')
    .run(conn)
    .catch(err => {
      throw new Error(err);
    });
};
