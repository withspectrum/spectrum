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
      .then(() =>
        Promise.all([
          // Get all user ids while we wait for the index to finish creating
          r.table('users').withFields('id').map(user => user('id')).run(conn),
          r.table('usersSettings').indexWait('userId').run(conn),
        ])
      )
      .then(([userIds]) => userIds.toArray())
      .then(userIds =>
        Promise.all(
          userIds.map(id =>
            r
              .table('usersSettings')
              .insert({
                userId: id,
                notifications: {
                  types: {
                    newMessageInThreads: {
                      email: true,
                    },
                  },
                },
              })
              .run(conn)
          )
        )
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
