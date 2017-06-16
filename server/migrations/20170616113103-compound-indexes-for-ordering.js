'use strict';

exports.up = function(r, conn) {
  return Promise.all([
    // messages#threadIdAndTimestamp
    r
      .table('messages')
      .indexCreate('threadIdAndTimestamp', [
        r.row('threadId'),
        r.row('timestamp'),
      ])
      .run(conn),
  ]).catch(err => {
    console.log(err);
    throw err;
  });
};

exports.down = function(r, conn) {
  // must return a Promise!
};
