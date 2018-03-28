exports.up = function(r, conn) {
  return Promise.all([
    r
      .tableCreate('slackImports')
      .run(conn)
      .catch(err => {
        console.log(err);
        throw err;
      }),
  ])
    .then(() =>
      Promise.all([
        r
          .table('slackImports')
          .indexCreate('communityId', r.row('communityId'))
          .run(conn)
          .catch(err => {
            console.log(err);
            throw err;
          }),
        r
          .table('users')
          .indexCreate('email', r.row('email'))
          .run(conn),
      ])
    )
    .catch(err => {
      console.log(err);
      throw err;
    });
};

exports.down = function(r, conn) {
  return Promise.all([r.tableDrop('slackImports').run(conn)]);
};
