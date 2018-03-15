exports.up = function(r, conn) {
  return r
    .tableCreate('communitySettings')
    .run(conn)
    .then(() =>
      r
        .table('communitySettings')
        .indexCreate('communityId', r.row('communityId'))
        .run(conn)
    )
    .catch(err => {
      console.log(err);
      throw err;
    });
};

exports.down = function(r, conn) {
  return Promise.all([r.tableDrop('communitySettings').run(conn)]);
};
