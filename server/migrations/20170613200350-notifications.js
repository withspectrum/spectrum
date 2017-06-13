'use strict';

exports.up = function(r, conn) {
  return (
    // Create new tables, update old ones with receiveNotifications
    Promise.all([
      r
        .table('usersChannels')
        .filter({ isBlocked: false })
        .update({ receiveNotifications: true })
        .run(conn),
      r
        .table('usersCommunities')
        .filter({ isBlocked: false })
        .update({ receiveNotifications: true })
        .run(conn),
      r.tableCreate('usersThreads').run(conn),
      r.tableCreate('usersNotifications').run(conn),
    ])
      // Add secondary indexes to new tables
      .then(() =>
        Promise.all([
          r.table('usersThreads').indexCreate('userId').run(conn),
          r.table('usersThreads').indexCreate('threadId').run(conn),
          r.table('usersNotifications').indexCreate('userId').run(conn),
        ])
      )
      // Insert data into new tables that should be there
      .then(() =>
        Promise.all([
          // Thread creators -> usersThreads
          db
            .table('threads')
            .filter(r.row.hasFields('deletedAt').not())
            .pluck(['creatorId', 'id'])
            .forEach(thread =>
              r
                .db('spectrum')
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
            .run(conn),
          // Thread participants -> usersThreads
          db
            .table('threads')
            .filter(db.row.hasFields('deletedAt').not())
            .pluck(['id'])
            .forEach(thread =>
              db
                .table('messages')
                .getAll(thread('id'), { index: 'threadId' })
                .map(message => message('senderId'))
                .distinct()
                .forEach(sender =>
                  db
                    .table('usersThreads')
                    .insert({
                      createdAt: db.now(),
                      isParticipant: true,
                      receiveNotifications: true,
                      threadId: thread('id'),
                      userId: sender,
                    })
                    .run(conn)
                )
            )
            .run(conn),
        ])
      )
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
