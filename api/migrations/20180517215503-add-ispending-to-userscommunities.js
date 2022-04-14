exports.up = async (r, conn) => {
  return r
    .table('usersCommunities')
    .update({
      isPending: false,
    })
    .run(conn);
};

exports.down = function(r, conn) {
  return r
    .table('usersCommunities')
    .update({
      isPending: r.literal(),
    })
    .run(conn);
};
