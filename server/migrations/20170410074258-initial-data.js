'use strict';

exports.up = function(r, conn) {
  return (
    Promise.all([
      r.tableCreate('stories').run(conn),
      r.tableCreate('frequencies').run(conn),
      r.tableCreate('communities').run(conn),
      r.tableCreate('messages').run(conn),
      r.tableCreate('sessions').run(conn),
      r.tableCreate('reactions').run(conn),
      r.tableCreate('direct_message_groups').run(conn),
      r.tableCreate('users', { primaryKey: 'uid' }).run(conn),
      r.tableCreate('notifications').run(conn),
    ])
      // Create secondary indexes
      .then(() =>
        Promise.all([
          // index user by username
          r.table('users').indexCreate('username', r.row('username')).run(conn),
          // index direct message groups by the users
          r
            .table('direct_message_groups')
            .indexCreate('users', { multi: true })
            .run(conn),
          r
            .table('notifications')
            .indexCreate(
              'user',
              notification => {
                return notification('users').map(user => user('uid'));
              },
              { multi: true }
            )
            .run(conn),
          // index notifications by story
          r
            .table('notifications')
            .indexCreate('story', r.row('story'))
            .run(conn),
          // index stories by author
          r.table('stories').indexCreate('author', r.row('author')).run(conn),
          // index stories by frequency
          r
            .table('stories')
            .indexCreate('frequency', r.row('frequency'))
            .run(conn),
          // index reactions by message
          r
            .table('reactions')
            .indexCreate('message', r.row('message'))
            .run(conn),
          // index frequencies by community
          r
            .table('frequencies')
            .indexCreate('community', r.row('community'))
            .run(conn),
          // index messages by thread
          r.table('messages').indexCreate('thread', r.row('thread')).run(conn),
        ])
      )
      .catch(err => {
        console.log(err);
      })
  );
};

exports.down = function(r, conn) {
  return Promise.all([
    r.tableDrop('stories').run(conn),
    r.tableDrop('frequencies').run(conn),
    r.tableDrop('communities').run(conn),
    r.tableDrop('messages').run(conn),
    r.tableDrop('sessions').run(conn),
    r.tableDrop('users').run(conn),
    r.tableDrop('direct_message_groups').run(conn),
    r.tableDrop('reactions').run(conn),
    r.tableDrop('notifications').run(conn),
  ]).catch(err => {
    console.log(err);
  });
};
