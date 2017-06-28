exports.up = function(r, conn) {
  return Promise.all([
    r
      .tableCreate('usersSettings')
      .run(conn)
      // Create secondary indexes
      .then(() =>
        // index user by username
        r
          .table('usersSettings')
          .indexCreate('userId', r.row('userId'))
          .run(conn)
      )
      .catch(err => {
        console.log(err);
        throw err;
      }),
  ]);
};

exports.down = function(r, conn) {
  return r.tableDrop('usersSettings').run(conn);
};
