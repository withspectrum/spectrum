exports.up = function(r, conn) {
  return r
    .tableCreate('pageviews')
    .run(conn)
    .catch(err => {
      console.error(err);
      throw err;
    });
};

exports.down = function(r, conn) {
  return r.tableDrop('pageviews').run(conn);
};
