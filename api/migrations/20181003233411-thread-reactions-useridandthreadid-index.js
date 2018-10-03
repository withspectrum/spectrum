exports.up = function(r, conn) {
  return r
    .table('threadReactions')
    .indexCreate('userIdAndThreadId', [r.row('userId'), r.row('threadId')])
    .run(conn);
};

exports.down = function(r, conn) {
  return r
    .table('threadReactions')
    .indexDrop('userIdAndThreadId')
    .run(conn);
};
