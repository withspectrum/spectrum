exports.up = async (r, conn) => {
  return r
    .table('users')
    .update({
      termsLastAcceptedAt: r.row('createdAt'),
    })
    .run(conn);
};

exports.down = function(r, conn) {
  return r
    .table('users')
    .update({
      termsLastAcceptedAt: r.literal(),
    })
    .run(conn);
};
