'use strict';

exports.up = function(r, connection) {
  return Promise.all([
    r
      .db('spectrum')
      .table('usersCommunities')
      .indexCreate('userIdAndCommunityId', [
        r.row('userId'),
        r.row('communityId'),
      ]),
  ]);
};

exports.down = function(r, connection) {
  return Promise.resolve();
};
