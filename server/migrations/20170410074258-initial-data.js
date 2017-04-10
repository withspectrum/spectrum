'use strict';
const data = require('./data/initial-data');

exports.up = function(r, conn) {
  return Promise
    .all([
      r.tableCreate('stories').run(conn),
      r.tableCreate('frequencies').run(conn),
      r.tableCreate('communities').run(conn),
    ])
    .then(() =>
      Promise.all([
        r.table('communities').insert(data.communities).run(conn),
        r.table('frequencies').insert(data.frequencies).run(conn),
        r.table('stories').insert(data.stories).run(conn),
      ]));
};

exports.down = function(r, conn) {
  return Promise.all([
    r.tableDrop('stories').run(conn),
    r.tableDrop('frequencies').run(conn),
    r.tableDrop('communities').run(conn),
  ]);
};
