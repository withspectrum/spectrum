exports.up = function(r, conn) {
  return r
    .tableCreate('pageview')
    .run(conn)
    .catch(err => {
      console.error(err);
      throw err;
    });
};

exports.down = function(r, conn) {
  return r.tableDrop('pageview').run(conn);
};
