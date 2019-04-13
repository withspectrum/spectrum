exports.up = function(r, conn) {
  return Promise.all([
    r
      .table('communities')
      .update(
        {
          memberCount: r
            .table('usersCommunities')
            .getAll(r.row('id'), { index: 'communityId' })
            .filter(row => row('isMember').eq(true))
            .count()
            .default(1),
        },
        {
          nonAtomic: true,
        }
      )
      .run(conn),
    r
      .table('channels')
      .update(
        {
          memberCount: r
            .table('usersChannels')
            .getAll(r.row('id'), { index: 'channelId' })
            .filter(row => row('isMember').eq(true))
            .count()
            .default(1),
        },
        {
          nonAtomic: true,
        }
      )
      .run(conn),
  ]).catch(err => console.error(err));
};
exports.down = function(r, conn) {
  return Promise.all([
    r
      .table('communities')
      .update({
        memberCount: r.literal(),
      })
      .run(conn),
    r
      .table('channels')
      .update({
        memberCount: r.literal(),
      })
      .run(conn),
  ]);
};
