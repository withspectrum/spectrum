exports.up = function(r, conn) {
  return r
    .table('threads')
    .update(
      {
        messageCount: r
          .table('messages')
          .getAll(r.row('id'), { index: 'threadId' })
          .filter(row => r.not(row.hasFields('deletedAt')))
          .count()
          .default(0),
        reactionCount: r
          .table('threadReactions')
          .getAll(r.row('id'), { index: 'threadId' })
          .filter(row => r.not(row.hasFields('deletedAt')))
          .count()
          .default(0),
      },
      {
        nonAtomic: true,
      }
    )
    .run(conn)
    .catch(err => console.error(err));
};

exports.down = function(r, conn) {
  return Promise.resolve();
};
