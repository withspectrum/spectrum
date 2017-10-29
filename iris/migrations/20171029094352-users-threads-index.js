'use strict';

exports.up = function(r, conn) {
  return r
    .db('spectrum')
    .table('usersThreads')
    .indexCreate('userIdAndThreadId', [r.row('userId'), r.row('threadId')])
    .run(conn);
};

exports.down = function(r, conn) {
  return r
    .db('spectrum')
    .table('usersThreads')
    .indexDrop('userIdAndThreadId')
    .run(conn);
};
