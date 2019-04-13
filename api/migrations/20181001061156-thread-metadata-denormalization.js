exports.up = function(r, conn) {
  return r
    .table('threads')
    .update(
      {
        messageCount: r
          .table('messages')
          .getAll(r.row('id'), { index: 'threadId' })
          .count()
          .default(0),
        reactionCount: r
          .table('threadReactions')
          .getAll(r.row('id'), { index: 'threadId' })
          .count()
          .default(0),
      },
      {
        nonAtomic: true,
      }
    )
    .run(conn)
    .then(() => {
      return Promise.all([
        r
          .table('threads')
          .indexCreate('messageCount')
          .run(conn),
        r
          .table('threads')
          .indexCreate('reactionCount')
          .run(conn),
      ]);
    })
    .catch(err => console.error(err));
};

exports.down = function(r, conn) {
  return r
    .table('threads')
    .update({
      messageCount: r.literal(),
      reactionCount: r.literal(),
    })
    .run(conn)
    .then(() => {
      return Promise.all([
        r
          .table('threads')
          .indexDrop('messageCount')
          .run(conn),
        r
          .table('threads')
          .indexDrop('reactionCount')
          .run(conn),
      ]);
    });
};
