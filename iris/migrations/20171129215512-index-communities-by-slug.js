exports.up = function(r, conn) {
  return Promise.all([
    r
      .table('communities')
      .indexCreate('slug')
      .run(conn),
  ]);
};

exports.down = function(r, conn) {
  return Promise.resolve();
};
