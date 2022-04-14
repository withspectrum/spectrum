exports.up = function(r, conn) {
  return r
    .tableCreate('channelSettings')
    .run(conn)
    .then(() =>
      r
        .table('channelSettings')
        .indexCreate('channelId', r.row('channelId'))
        .run(conn)
    )
    .catch(err => {
      console.error(err);
      throw err;
    });
};

exports.down = function(r, conn) {
  return Promise.all([r.tableDrop('channelSettings').run(conn)]);
};
