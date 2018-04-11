exports.up = async (r, conn) => {
  return Promise.all([
    r
      .table('users')
      .update({
        username: r.row('username').downcase(),
        email: r.row('email').downcase(),
      })
      .run(conn),
    r
      .table('communities')
      .update({
        slug: r.row('slug').downcase(),
      })
      .run(conn),
    r
      .table('channels')
      .update({
        slug: r.row('slug').downcase(),
      })
      .run(conn),
  ]);
};

exports.down = function(r, conn) {
  return Promise.resolve();
};
