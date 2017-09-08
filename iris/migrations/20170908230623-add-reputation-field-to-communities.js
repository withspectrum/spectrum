exports.up = function(r, conn) {
  return r
    .table('usersCommunities')
    .update({
      reputation: 1,
    })
    .run(conn)
    .catch(err => console.log(err));
};

exports.down = function(r, conn) {
  return r
    .table('usersCommunities')
    .update({
      reputation: r.literal(),
    })
    .run(conn)
    .catch(err => console.log(err));
};
