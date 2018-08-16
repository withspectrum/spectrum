exports.up = async (r, conn) => {
  return r
    .table('communities')
    .update({
      isPrivate: false,
    })
    .run(conn);
};

exports.down = function(r, conn) {
  return r
    .table('communities')
    .update({
      isPrivate: r.literal(),
    })
    .run(conn);
};
