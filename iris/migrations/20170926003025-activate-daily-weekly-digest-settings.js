exports.up = function(r, conn) {
  return Promise.all([
    r
      .table('usersSettings')
      .update({
        notifications: {
          types: {
            dailyDigest: {
              email: true,
            },
            weeklyDigest: {
              email: true,
            },
          },
        },
      })
      .run(conn),
  ]);
};

exports.down = function(r, conn) {
  return Promise.resolve();
};
