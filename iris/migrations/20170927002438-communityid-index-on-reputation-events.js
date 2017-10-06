'use strict';

exports.up = function(r, conn) {
  return Promise.all([
    r
      .table('reputationEvents')
      .indexCreate('communityId')
      .run(conn),
  ]);
};

exports.down = function(r, conn) {
  return Promise.resolve();
};
