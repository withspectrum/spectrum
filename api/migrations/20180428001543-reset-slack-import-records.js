exports.up = function(r, conn) {
  return Promise.all([
    r
      .table('slackImports')
      .update({
        members: r.literal(),
      })
      .run(conn),
  ]).catch(err => console.error(err));
};

exports.down = function(r, conn) {
  return Promise.resolve();
};
