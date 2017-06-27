exports.up = function(r, conn) {
  return (
    Promise.all([
      r.tableCreate('usersSettings').run(conn).catch(err => {
        console.log(err);
        throw err;
      }),
    ])
      // Create secondary indexes
      .then(() =>
        Promise.all([
          // index user by username
          r
            .table('usersSettings')
            .indexCreate('userId', r.row('userId'))
            .run(conn)
            .catch(err => {
              console.log(err);
              throw err;
            }),
        ])
      )
      .catch(err => {
        console.log(err);
        throw err;
      })
  );
};

exports.down = function(r, conn) {
  return Promise.all([r.tableDrop('usersSettings').run(conn)]).catch(err => {
    console.log(err);
    throw err;
  });
};
