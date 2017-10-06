'use strict';

exports.up = function(r, conn) {
  return Promise.all([
    r
      .table('usersCommunities')
      .indexCreate('userIdAndCommunityId', [
        r.row('userId'),
        r.row('communityId'),
      ])
      .run(conn),
  ]);
};

exports.down = function(r, conn) {
  return Promise.resolve();
};
