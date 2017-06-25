'use strict';

exports.up = function(r, conn) {
  return Promise.all([
    r.tableCreate('slackImports').run(conn).catch(err => {
      console.log(err);
      throw err;
    }),
    r.tableCreate('communityInvitations').run(conn).catch(err => {
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
          .table('communityInvitations')
          .indexCreate('communityId', r.row('communityId'))
          .run(conn)
          .catch(err => {
            console.log(err);
            throw err;
          }),
        r
          .table('communityInvitations')
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
    });
};

exports.down = function(r, conn) {
  return Promise.all([
    r.tableDrop('communityInvitations').run(conn),
    r.tableDrop('slackImports').run(conn),
  ]);
};
