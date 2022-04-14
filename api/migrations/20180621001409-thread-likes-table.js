exports.up = function(r, conn) {
  return r
    .tableCreate('threadReactions')
    .run(conn)
    .then(() => {
      return Promise.all([
        r
          .table('threadReactions')
          .indexCreate('threadId')
          .run(conn),
        r
          .table('threadReactions')
          .indexCreate('userId')
          .run(conn),
      ]);
    })
    .catch(err => console.error(err));
};

exports.down = function(r, conn) {
  return Promise.all([r.tableDrop('threadReactions').run(conn)]);
};
