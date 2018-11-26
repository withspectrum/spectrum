const branch = (r, field, fallback) => {
  return r.branch(r.row(`is${field}`).eq(true), field.toLowerCase(), fallback);
};

exports.up = function(r, conn) {
  return Promise.all([
    r
      .table('usersChannels')
      .indexCreate('channelIdAndRole', [
        r.row('channelId'),
        branch(
          r,
          'Pending',
          branch(
            r,
            'Blocked',
            branch(
              r,
              'Owner',
              branch(r, 'Moderator', branch(r, 'Member', r.literal()))
            )
          )
        ),
      ])
      .run(conn),
    r
      .table('usersChannels')
      .indexCreate('userIdAndRole', [
        r.row('userId'),
        branch(
          r,
          'Pending',
          branch(
            r,
            'Blocked',
            branch(
              r,
              'Owner',
              branch(r, 'Moderator', branch(r, 'Member', r.literal()))
            )
          )
        ),
      ])
      .run(conn),
  ]);
};

exports.down = function(r, conn) {
  return Promise.all([
    r
      .table('usersChannels')
      .indexDrop('channelIdAndRole')
      .run(conn),
    r
      .table('usersChannels')
      .indexDrop('userIdAndRole')
      .run(conn),
  ]);
};
