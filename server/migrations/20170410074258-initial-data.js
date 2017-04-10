'use strict';
const data = require('./data/initial-data');

exports.up = function(r, conn) {
  return Promise
    .all([
      r.tableCreate('stories').run(conn),
      r.tableCreate('frequencies').run(conn),
      r.tableCreate('communities').run(conn),
      r.tableCreate('messages').run(conn),
    ])
    .then(() =>
      Promise.all([
        r.table('communities').insert(data.communities).run(conn),
        r.table('frequencies').insert(data.frequencies).run(conn),
        r.table('stories').insert(data.stories).run(conn),
        r.table('messages').insert(data.messages).run(conn),
      ]))
    .catch(err => {
      console.log(err);
    });
};

exports.down = function(r, conn) {
  return Promise
    .all([
      r.tableDrop('stories').run(conn),
      r.tableDrop('frequencies').run(conn),
      r.tableDrop('communities').run(conn),
      r.tableDrop('messages').run(conn),
    ])
    .catch(err => {
      console.log(err);
    });
};
