exports.up = function(r, conn) {
  /**
    We're adding `isArchived` and defaulting it to `false` in `usersDirectMessageThreads`
    All DMThreads are not archived
  */
  return Promise.all([
    r
      .table('usersDirectMessageThreads')
      .update({
        isArchived: false,
      })
      .run(conn)
      .catch(err => {
        throw err;
      }),
  ]);
};

exports.down = function(r, conn) {
  return r
    .table('usersDirectMessageThreads')
    .update({
      isArchived: r.literal(),
    })
    .run(conn)
    .catch(err => {
      throw err;
    });
};
