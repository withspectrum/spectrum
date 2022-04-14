exports.up = function(r, conn) {
  return Promise.all([
    r
      .table('usersThreads')
      .indexCreate('userIdAndIsParticipant', [
        r.row('userId'),
        r.row('isParticipant'),
      ])
      .run(conn),
  ]);
};
exports.down = function(r, conn) {
  return Promise.all([
    r
      .table('usersThreads')
      .indexDrop('userIdAndIsParticipant')
      .run(conn),
  ]);
};
