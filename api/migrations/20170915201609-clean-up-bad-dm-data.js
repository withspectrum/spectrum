exports.up = function(r, conn) {
  return Promise.all([
    r
      .table('messages')
      .filter({ threadType: 'DIRECT_MESSAGE_GROUP' })
      .update({
        threadType: 'directMessageThread',
      })
      .run(conn),
    r
      .table('messages')
      .filter({ threadType: 'STORY' })
      .update({
        threadType: 'story',
      })
      .run(conn),
  ]);
};

exports.down = function(r, conn) {
  return Promise.resolve();
};
