exports.up = function(r, conn) {
  return Promise.all([
    r
      .table('usersSettings')
      .update({
        notifications: {
          types: {
            newMessageInThreads: {
              email: r.row('notifications')('types')('newMessageInThreads')(
                'email'
              ),
            },
            newThreadCreated: {
              email: true,
            },
          },
        },
      })
      .run(conn)
      .catch(err => {
        console.log(err);
        throw err;
      }),
  ]);
};

exports.down = function(r, conn) {
  return Promise.resolve();
};
