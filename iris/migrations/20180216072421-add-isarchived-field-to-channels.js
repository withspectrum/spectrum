require('now-env');

exports.up = function(r, conn) {
  return Promise.all([
    r
      .table('channels')
      .update({
        isArchived: false,
      })
      .run(conn),
  ]).catch(err => console.log(err));
};

exports.down = function(r, conn) {
  return Promise.all([
    r
      .table('channels')
      .update({ isArchived: r.literal() })
      .run(conn),
  ]);
};
