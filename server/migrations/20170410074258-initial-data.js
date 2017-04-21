'use strict';

exports.up = function(r, conn) {
  return Promise.all([
    r.tableCreate('stories').run(conn),
    r.tableCreate('frequencies').run(conn),
    r.tableCreate('communities').run(conn),
    r.tableCreate('messages').run(conn),
    r.tableCreate('direct_messages').run(conn),
    r.tableCreate('sessions').run(conn),
    r.tableCreate('reactions').run(conn),
    r.tableCreate('direct_message_groups').run(conn),
    r.tableCreate('users', { primaryKey: 'uid' }).run(conn),
  ]).catch(err => {
    console.log(err);
  });
};

exports.down = function(r, conn) {
  return Promise.all([
    r.tableDrop('stories').run(conn),
    r.tableDrop('frequencies').run(conn),
    r.tableDrop('communities').run(conn),
    r.tableDrop('messages').run(conn),
    r.tableDrop('direct_messages').run(conn),
    r.tableDrop('sessions').run(conn),
    r.tableDrop('users').run(conn),
    r.tableDrop('direct_message_groups').run(conn),
    r.tableDrop('reactions').run(conn),
  ]).catch(err => {
    console.log(err);
  });
};
