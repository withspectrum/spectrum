'use strict';

exports.up = function(r, conn) {
  return r
    .table('usersChannels')
    .indexCreate('userIdAndChannelId', [r.row('userId'), r.row('channelId')])
    .run(conn);
};

exports.down = function(r, conn) {
  return r
    .table('usersChannels')
    .indexDrop('userIdAndChannelId')
    .run(conn);
};
