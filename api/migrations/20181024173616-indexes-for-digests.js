exports.up = function(r, conn) {
  return Promise.all([
    r
      .table('usersSettings')
      .indexCreate(
        'weeklyDigestEmail',
        r.row('notifications')('types')('weeklyDigest')('email')
      )
      .run(conn),
    r
      .table('usersSettings')
      .indexCreate(
        'dailyDigestEmail',
        r.row('notifications')('types')('dailyDigest')('email')
      )
      .run(conn),
  ]);
};

exports.down = function(r, conn) {
  return Promise.all([
    r
      .table('usersSettings')
      .indexDrop('weeklyDigestEmail')
      .run(conn),
    r
      .table('usersSettings')
      .indexDrop('dailyDigestEmail')
      .run(conn),
  ]);
};
