exports.up = function(r, conn) {
  return Promise.all([
    r
      .table('usersCommunities')
      .update({
        reputation: 1,
      })
      .run(conn)
      .catch(err => {
        console.log(err);
        throw err;
      }),
    r
      .tableCreate('reputationEvents')
      .run(conn)
      .catch(err => {
        console.log(err);
        throw err;
      }),
  ]).then(() => {
    // create a compound index to easily fetch all reputation events in chronological order
    return Promise.all([
      r
        .table('reputationEvents')
        .indexCreate('userIdAndTimestamp', [
          r.row('userId'),
          r.row('timestamp'),
        ])
        .run(conn)
        .catch(err => {
          console.log(err);
          throw err;
        }),
    ]);
  });
};

exports.down = function(r, conn) {
  return Promise.resolve();
};
