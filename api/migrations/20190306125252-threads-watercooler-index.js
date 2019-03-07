exports.up = function(r, conn) {
  return r
    .table('threads')
    .indexCreate('communityIdAndWatercooler', [
      r.row('communityId'),
      r.row('watercooler'),
    ])
    .run(conn);
};

exports.down = function(r, conn) {
  return r
    .table('threads')
    .indexDrop('communityIdAndWatercooler')
    .run(conn);
};
