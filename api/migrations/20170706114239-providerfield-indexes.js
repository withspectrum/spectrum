exports.up = function(r, conn) {
  return Promise.all([
    r
      .table('users')
      .indexCreate('providerId')
      .run(conn),
    r
      .table('users')
      .indexCreate('fbProviderId')
      .run(conn),
    r
      .table('users')
      .indexCreate('googleProviderId')
      .run(conn),
  ]).catch(err => {
    console.log(err);
    throw err;
  });
};

exports.down = function(r, conn) {
  return Promise.resolve();
};
