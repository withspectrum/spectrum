exports.up = function(r, conn) {
  return r
    .table('users')
    .update({
      githubUsername: r.literal(),
    })
    .run(conn);
};

exports.down = function(r, conn) {
  return Promise.resolve();
};
