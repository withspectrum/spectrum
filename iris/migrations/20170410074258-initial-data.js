'use strict';

exports.up = function(r, conn) {
  return (
    Promise.all([
      r.tableCreate('threads').run(conn).catch(err => {
        console.log(err);
        throw err;
      }),
      r.tableCreate('channels').run(conn).catch(err => {
        console.log(err);
        throw err;
      }),
      r.tableCreate('communities').run(conn).catch(err => {
        console.log(err);
        throw err;
      }),
      r.tableCreate('messages').run(conn).catch(err => {
        console.log(err);
        throw err;
      }),
      r.tableCreate('sessions').run(conn).catch(err => {
        console.log(err);
        throw err;
      }),
      r.tableCreate('reactions').run(conn).catch(err => {
        console.log(err);
        throw err;
      }),
      r.tableCreate('directMessageThreads').run(conn).catch(err => {
        console.log(err);
        throw err;
      }),
      r.tableCreate('users').run(conn).catch(err => {
        console.log(err);
        throw err;
      }),
      r.tableCreate('recurringPayments').run(conn).catch(err => {
        console.log(err);
        throw err;
      }),
      r.tableCreate('invoices').run(conn).catch(err => {
        console.log(err);
        throw err;
      }),
      r.tableCreate('usersCommunities').run(conn).catch(err => {
        console.log(err);
        throw err;
      }),
      r.tableCreate('usersChannels').run(conn).catch(err => {
        console.log(err);
        throw err;
      }),
      r.tableCreate('usersDirectMessageThreads').run(conn).catch(err => {
        console.log(err);
        throw err;
      }),
    ])
      // Create secondary indexes
      .then(() =>
        Promise.all([
          // index user by username
          r
            .table('users')
            .indexCreate('username', r.row('username'))
            .run(conn)
            .catch(err => {
              console.log(err);
              throw err;
            }),
          // index recurringPayments by userId
          r
            .table('recurringPayments')
            .indexCreate('userId', r.row('userId'))
            .run(conn)
            .catch(err => {
              console.log(err);
              throw err;
            }),
          // index invoices by communityId
          r
            .table('invoices')
            .indexCreate('communityId', r.row('communityId'))
            .run(conn)
            .catch(err => {
              console.log(err);
              throw err;
            }),
          // indexes on usersCommunities join table
          r
            .table('usersCommunities')
            .indexCreate('userId', r.row('userId'))
            .run(conn)
            .catch(err => {
              console.log(err);
              throw err;
            }),
          r
            .table('usersCommunities')
            .indexCreate('communityId', r.row('communityId'))
            .run(conn)
            .catch(err => {
              console.log(err);
              throw err;
            }),
          // indexes on usersChannels join table
          r
            .table('usersChannels')
            .indexCreate('userId', r.row('userId'))
            .run(conn)
            .catch(err => {
              console.log(err);
              throw err;
            }),
          r
            .table('usersChannels')
            .indexCreate('channelId', r.row('channelId'))
            .run(conn)
            .catch(err => {
              console.log(err);
              throw err;
            }),
          // indexes on usersDirectMessageThreads join table
          r
            .table('usersDirectMessageThreads')
            .indexCreate('userId', r.row('userId'))
            .run(conn)
            .catch(err => {
              console.log(err);
              throw err;
            }),
          r
            .table('usersDirectMessageThreads')
            .indexCreate('threadId', r.row('threadId'))
            .run(conn)
            .catch(err => {
              console.log(err);
              throw err;
            }),
          // index direct message threads by the users
          r
            .table('directMessageThreads')
            .indexCreate('participants', { multi: true })
            .run(conn)
            .catch(err => {
              console.log(err);
              throw err;
            }),
          // index threads by creator
          r
            .table('threads')
            .indexCreate('creatorId', r.row('creatorId'))
            .run(conn)
            .catch(err => {
              console.log(err);
              throw err;
            }),
          // index threads by channelId
          r
            .table('threads')
            .indexCreate('channelId', r.row('channelId'))
            .run(conn)
            .catch(err => {
              console.log(err);
              throw err;
            }),
          // index threads by communityId
          r
            .table('threads')
            .indexCreate('communityId', r.row('communityId'))
            .run(conn)
            .catch(err => {
              console.log(err);
              throw err;
            }),
          // index threads by lastActive
          r
            .table('threads')
            .indexCreate('lastActive', r.row('lastActive'))
            .run(conn)
            .catch(err => {
              console.log(err);
              throw err;
            }),
          // index reactions by message
          r
            .table('reactions')
            .indexCreate('messageId', r.row('messageId'))
            .run(conn)
            .catch(err => {
              console.log(err);
              throw err;
            }),
          // index channels by communityId
          r
            .table('channels')
            .indexCreate('communityId', r.row('communityId'))
            .run(conn)
            .catch(err => {
              console.log(err);
              throw err;
            }),
          // index messages by thread
          r
            .table('messages')
            .indexCreate('threadId', r.row('threadId'))
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
    r.tableDrop('threads').run(conn).catch(err => {
      console.log(err);
      throw err;
    }),
    r.tableDrop('channels').run(conn).catch(err => {
      console.log(err);
      throw err;
    }),
    r.tableDrop('communities').run(conn).catch(err => {
      console.log(err);
      throw err;
    }),
    r.tableDrop('messages').run(conn).catch(err => {
      console.log(err);
      throw err;
    }),
    r.tableDrop('sessions').run(conn).catch(err => {
      console.log(err);
      throw err;
    }),
    r.tableDrop('users').run(conn).catch(err => {
      console.log(err);
      throw err;
    }),
    r.tableDrop('directMessageThreads').run(conn).catch(err => {
      console.log(err);
      throw err;
    }),
    r.tableDrop('reactions').run(conn).catch(err => {
      console.log(err);
      throw err;
    }),
    r.tableDrop('recurringPayments').run(conn).catch(err => {
      console.log(err);
      throw err;
    }),
    r.tableDrop('invoices').run(conn).catch(err => {
      console.log(err);
      throw err;
    }),
    r.tableDrop('usersCommunities').run(conn).catch(err => {
      console.log(err);
      throw err;
    }),
    r.tableDrop('usersChannels').run(conn).catch(err => {
      console.log(err);
      throw err;
    }),
    r.tableDrop('usersDirectMessageThreads').run(conn).catch(err => {
      console.log(err);
      throw err;
    }),
  ]).catch(err => {
    console.log(err);
    throw err;
  });
};
