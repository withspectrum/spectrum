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
    .then(() => {
      return r
        .table('coreMetrics')
        .indexCreate('date', r.row('date'))
        .run(conn)
        .catch(err => {
          console.log(err);
          throw err;
        });
    })
    .then(() => {
      const saveCoreMetrics = (data, index) => {
        const d = new Date();
        d.setDate(d.getDate() - index);
        return r
          .table('coreMetrics')
          .insert({
            date: d,
            ...data,
          })
          .run(conn);
      };

      const getCount = (table, filter, index, field) => {
        if (filter) {
          return r
            .table(table)
            .filter(filter)
            .filter(
              r.row(field).during(
                // go back to all time, for some reason minval isn't working
                r.now().sub(60 * 60 * 24 * 10000),
                r.now().sub(60 * 60 * 24 * index)
              )
            )
            .filter(row => r.not(row.hasFields('deletedAt')))
            .count()
            .run(conn);
        }

        return r
          .table(table)
          .filter(
            r.row(field).during(
              // go back to all time, for some reason minval isn't working
              r.now().sub(60 * 60 * 24 * 10000),
              r.now().sub(60 * 60 * 24 * index)
            )
          )
          .filter(row => r.not(row.hasFields('deletedAt')))
          .count()
          .run(conn);
      };

      // cpu, tpu, mpu
      const getPu = (table, field, index) => {
        // get the count of the users within a given range
        return getCount('users', null, index, 'createdAt')
          .then(userCount => {
            // get the count of whatever entity within a given range
            const tableCount = r
              .table(table)
              .filter(
                r.row(field).during(
                  // go back to all time, for some reason minval isn't working
                  r.now().sub(60 * 60 * 24 * 10000),
                  r.now().sub(60 * 60 * 24 * index)
                )
              )
              .filter(row => r.not(row.hasFields('deletedAt')))
              .count()
              .run(conn);

            return Promise.all([userCount, tableCount]);
          })
          .then(([userCount, tableCount]) => {
            return parseFloat((tableCount / userCount).toFixed(3));
          });
      };

      // array of 30 things
      const arr = Array.apply(null, { length: 60 }).map(() => 0);
      const backfill = arr.map((o, i) => {
        const cpu = getPu('usersCommunities', 'createdAt', i);
        const mpu = getPu('messages', 'timestamp', i);
        const tpu = getPu('threads', 'createdAt', i);
        const users = getCount('users', null, i, 'createdAt');
        const communities = getCount('communities', null, i, 'createdAt');
        const threads = getCount('threads', null, i, 'createdAt');
        const dmThreads = getCount(
          'directMessageThreads',
          null,
          i,
          'createdAt'
        );
        const threadMessages = getCount(
          'messages',
          { threadType: 'story' },
          i,
          'timestamp'
        );
        const dmMessages = getCount(
          'messages',
          {
            threadType: 'directMessageThread',
          },
          i,
          'timestamp'
        );

        return Promise.all([
          cpu,
          mpu,
          tpu,
          users,
          communities,
          threads,
          dmThreads,
          threadMessages,
          dmMessages,
        ]).then(
          (
            [
              cpu,
              mpu,
              tpu,
              users,
              communities,
              threads,
              dmThreads,
              threadMessages,
              dmMessages,
            ]
          ) => {
            const coreMetrics = {
              cpu,
              mpu,
              tpu,
              users,
              communities,
              threads,
              dmThreads,
              threadMessages,
              dmMessages,
            };
            return saveCoreMetrics(coreMetrics, i);
          }
        );
      });

      return Promise.all(backfill);
    })
    .catch(err => {
      console.log(err);
      throw err;
    });
};

exports.down = function(r, conn) {
  return Promise.all([r.tableDrop('coreMetrics').run(conn)]);
};
