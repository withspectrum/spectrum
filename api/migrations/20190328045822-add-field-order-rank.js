'use strict';

exports.up = function(r, conn) {
  return r
    .table('channels')
    .update({
      orderRank: 0,
    })
    .run(conn);
};

exports.down = function(r, conn) {
  return r
    .table('channels')
    .update({
      orderRank: r.literal(),
    })
    .run(conn);
};
