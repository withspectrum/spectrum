exports.up = function(r, conn) {
  return Promise.all([
    r
      .table('usersCommunities')
      .update(
        {
          lastSeen: r
            .table('users')
            .get(r.row('userId'))('lastSeen')
            .default(r.row('lastSeen')),
        },
        {
          nonAtomic: true,
        }
      )
      .run(conn),
    r
      .table('communities')
      .update(
        {
          lastActive: r
            .table('threads')
            .between(
              [r.row('communityId'), r.minval],
              [r.row('communityId'), r.maxval],
              {
                index: 'communityIdAndLastActive',
                leftBound: 'open',
                rightBound: 'open',
              }
            )
            .orderBy({ index: r.desc('communityIdAndLastActive') })
            .limit(1)('lastActive')
            .default(r.row('createdAt')),
        },
        {
          nonAtomic: true,
        }
      )
      .run(conn),
  ]);
};

exports.down = function(r, conn) {
  return Promise.all([
    r
      .table('usersCommunities')
      .update({
        lastSeen: r.literal(),
      })
      .run(conn),
    r
      .table('communities')
      .update({
        lastActive: r.literal(),
      })
      .run(conn),
  ]);
};
