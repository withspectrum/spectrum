// @flow
exports.up = function(r, conn) {
  const updateReputation = (userId, communityId, score, type) => {
    return r
      .table('usersCommunities')
      .getAll(userId, { index: 'userId' })
      .filter({ communityId })
      .update({
        reputation: r.row('reputation').add(score),
      })
      .run(conn)
      .then(() => {
        return r
          .table('reputationEvents')
          .insert({
            timestamp: new Date(),
            userId,
            type,
            communityId,
            score,
          })
          .run(conn);
      });
  };

  return r
    .table('threads')
    .filter(row => row.hasFields('deletedAt').not())
    .run(conn)
    .then(cursor => cursor.toArray())
    .then(threads => {
      const threadPromises = threads.map(thread => {
        return updateReputation(
          thread.creatorId,
          thread.communityId,
          100,
          'thread created'
        );
      });

      return Promise.all(threadPromises);
    });
};

exports.down = function(r, conn) {
  return Promise.resolve();
};
