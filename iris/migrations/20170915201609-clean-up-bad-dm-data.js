// @flow
exports.up = function(r, conn) {
  return r
    .table('messages')
    .filter({ threadType: 'DIRECT_MESSAGE_GROUP' })
    .update({
      threadType: 'directMessageThread',
    })
    .run(conn);
};

exports.down = function(r, conn) {
  return Promise.resolve();
};
