exports.up = function(r, conn) {
  return r
    .table('usersCommunities')
    .indexCreate('userIdAndIsMember', [r.row('userId'), r.row('isMember')])
    .run(conn);
};

exports.down = function(r, conn) {
  return r
    .table('usersCommunities')
    .indexDrop('userIdAndIsMember')
    .run(conn);
};
