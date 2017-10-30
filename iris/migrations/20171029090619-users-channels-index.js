'use strict';

exports.up = function(r, conn) {
  return r
    .db('spectrum')
    .table('usersChannels')
    .indexCreate('userIdAndChannelId', [r.row('userId'), r.row('channelId')])
    .run(conn);
};

exports.down = function(r, conn) {
  return r
    .db('spectrum')
    .table('usersChannels')
    .indexDrop('userIdAndChannelId')
    .run(conn);
};
