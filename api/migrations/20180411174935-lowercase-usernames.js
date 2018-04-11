exports.up = async (r, conn) => {
  return r
    .table('users')
    .update({
      username: r.row('username').downcase(),
    })
    .run(conn);
};

exports.down = function(r, conn) {
  return Promise.resolve();
};
