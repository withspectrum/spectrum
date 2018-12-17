exports.up = function(r, conn) {
  return r
    .table('communities')
    .indexCreate('memberCount')
    .run(conn);
};

exports.down = function(r, conn) {
  return r
    .table('communities')
    .indexDrop('memberCount')
    .run(conn);
};
