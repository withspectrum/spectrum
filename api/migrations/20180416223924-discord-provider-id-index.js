exports.up = function(r, conn) {
  return Promise.all([
    r
      .table('users')
      .indexCreate('discordProviderId')
      .run(conn),
  ]).catch(err => {
    console.log(err);
    throw err;
  });
};

exports.down = function(r, conn) {
  return Promise.resolve();
};
