exports.up = function(r, conn) {
  return Promise.all([
    r
      .table('users')
      .update({
        modifiedAt: new Date(),
      })
      .run(conn),
    r
      .table('communities')
      .update({
        modifiedAt: new Date(),
      })
      .run(conn),
  ]);
};

exports.down = function(r, conn) {
  return Promise.all([
    r
      .table('users')
      .update({
        modifiedAt: r.literal(),
      })
      .run(conn),
    r
      .table('communities')
      .update({
        modifiedAt: r.literal(),
      })
      .run(conn),
  ]);
};
