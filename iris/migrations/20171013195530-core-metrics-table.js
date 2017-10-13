'use strict';

exports.up = function(r, conn) {
  return Promise.all([
    r
      .tableCreate('coreMetrics')
      .run(conn)
      .catch(err => {
        console.log(err);
        throw err;
      }),
  ])
    .then(() =>
      Promise.all([
        r
          .table('coreMetrics')
          .indexCreate('date', r.row('date'))
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
    });
};

exports.down = function(r, conn) {
  return Promise.all([r.tableDrop('coreMetrics').run(conn)]);
};
