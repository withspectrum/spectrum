'use strict';

exports.up = function(r, conn) {
  return (
    // Create new tables, update old ones with receiveNotifications
    Promise.all([
      r
        .table('usersChannels')
        .filter({ isBlocked: false })
        .update({ receiveNotifications: true })
        .run(conn)
        .catch(err => {
          console.log(err);
          throw err;
        }),
      r
        .table('usersCommunities')
        .filter({ isBlocked: false })
        .update({ receiveNotifications: true })
        .run(conn)
        .catch(err => {
          console.log(err);
          throw err;
        }),
      r.tableCreate('usersThreads').run(conn).catch(err => {
        console.log(err);
        throw err;
      }),
      r.tableCreate('usersNotifications').run(conn).catch(err => {
        console.log(err);
        throw err;
      }),
    ])
      // Add secondary indexes to new tables
      .then(() =>
        Promise.all([
          r.table('usersThreads').indexCreate('userId').run(conn).catch(err => {
            console.log(err);
            throw err;
          }),
          r
            .table('usersThreads')
            .indexCreate('threadId')
            .run(conn)
            .catch(err => {
              console.log(err);
              throw err;
            }),
          r
            .table('usersNotifications')
            .indexCreate('userId')
            .run(conn)
            .catch(err => {
              console.log(err);
              throw err;
            }),
          // Need this for the data migration below
          r.table('messages').indexCreate('senderId').run(conn).catch(err => {
            console.log(err);
            throw err;
          }),
        ])
      )
      // Since we need it down below we gotta wait until it's available
      .then(() => r.table('messages').indexWait('senderId').run(conn))
      // Insert data into new tables that should be there
      .then(() =>
        Promise.all([
          // Thread creators -> usersThreads
          r
            .table('threads')
            .filter(r.row.hasFields('deletedAt').not())
            .pluck(['creatorId', 'id'])
            .forEach(thread =>
              r
                .table('usersThreads')
                .insert({
                  createdAt: r.now(),
                  isParticipant: true,
                  receiveNotifications: true,
                  threadId: thread('id'),
                  userId: thread('creatorId'),
                })
                .run(conn)
            )
            .run(conn)
            .catch(err => {
              console.log(err);
              throw err;
            }),
          // Thread participants -> usersThreads
          r
            .table('threads')
            .filter(r.row.hasFields('deletedAt').not())
            .pluck(['id'])
            .forEach(thread =>
              r
                .table('messages')
                // Can't run a .distinct without an index, that's why we create it further up
                // also can't run an indexed distinct on anything but a table, so we can't use .getAll
                // but have to filter below
                .distinct({ index: 'senderId' })
                .filter({ threadId: thread('id') })
                .forEach(message =>
                  r
                    .table('usersThreads')
                    .insert({
                      createdAt: r.now(),
                      isParticipant: true,
                      receiveNotifications: true,
                      threadId: message('threadId'),
                      userId: message('senderId'),
                    })
                    .run(conn)
                    .catch(err => {
                      console.log(err);
                      throw err;
                    })
                )
                .run(conn)
                .catch(err => {
                  console.log(err);
                  throw err;
                })
            )
            .run(conn)
            .catch(err => {
              console.log(err);
              throw err;
            }),
        ])
      )
      .catch(err => {
        console.log(err);
        throw err;
      })
  );
};

exports.down = function(r, conn) {
  return Promise.all([
    r.tableDrop('usersThreads'),
    r.tableDrop('usersNotifications'),
    r
      .table('usersCommunities')
      .update({ receiveNotifications: r.literal() })
      .run(conn),
    r
      .table('usersCommunities')
      .update({ receiveNotifications: r.literal() })
      .run(conn),
  ]);
};
