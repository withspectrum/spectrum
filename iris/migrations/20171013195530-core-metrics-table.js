'use strict';

exports.up = function(r, conn) {
  return Promise.all([
    // r
    //   .tableCreate('coreMetrics')
    //   .run(conn)
    //   .catch(err => {
    //     console.log(err);
    //     throw err;
    //   })
  ])
    .then(() => {
      // return r
      //   .table('coreMetrics')
      //   .indexCreate('date', r.row('date'))
      //   .run(conn)
      //   .catch(err => {
      //     console.log(err);
      //     throw err;
      //   })
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

      // dau, wau, mau
      const getAu = (range, index) => {
        return r
          .table('users')
          .filter(
            r
              .row('lastSeen')
              .during(
                r.now().sub(60 * 60 * 24 * (index + 30)),
                r.now().sub(60 * 60 * 24 * index)
              )
          )
          .count()
          .default(0)
          .run(conn);
      };

      function getCommunitiesWithMinimumMembers(min, index) {
        return r
          .table('communities')
          .filter(
            r
              .row('createdAt')
              .during(
                r.now().sub(60 * 60 * 24 * (index + 30)),
                r.now().sub(60 * 60 * 24 * index)
              )
          )
          .pluck('id')
          .run(conn)
          .then(cursor => cursor.toArray())
          .then(communities => communities.map(community => community.id))
          .then(communityIds => {
            return Promise.all(
              communityIds.map(community => {
                return r
                  .table('usersCommunities')
                  .getAll(community, { index: 'communityId' })
                  .filter({ isMember: true })
                  .eqJoin('userId', r.table('users'))
                  .zip()
                  .filter(
                    r
                      .row('lastActive')
                      .during(
                        r.now().sub(60 * 60 * 24 * (index + 30)),
                        r.now().sub(60 * 60 * 24 * index)
                      )
                  )
                  .count()
                  .run(conn)
                  .then(cursor => cursor.toArray())
                  .then(count => {
                    return {
                      id: community,
                      count,
                    };
                  });
              })
            );
          })
          .then(data => {
            let sortedCommunities = data
              .filter(c => c.count > min)
              .map(community => community.id);

            return r
              .table('communities')
              .getAll(...sortedCommunities)
              .filter(community => r.not(community.hasFields('deletedAt')))
              .run(conn)
              .then(cursor => cursor.toArray());
          });
      }

      // dac, wac, mac
      const getAc = (range, index) => {
        // constants
        const MIN_THREAD_COUNT = 5;
        const MIN_MEMBER_COUNT = 50;

        // get threads posted in the range
        return Promise.all([
          r
            .table('threads')
            .filter(
              r
                .row('lastActive')
                .during(
                  r.now().sub(60 * 60 * 24 * (index + 30)),
                  r.now().sub(60 * 60 * 24 * index)
                )
            )
            .filter(thread => r.not(thread.hasFields('deletedAt')))
            .run(conn)
            .then(cursor => cursor.toArray()),
        ]).then(([threadsPostedInRange]) => {
          // we will iterate through each thread and accumulate the counts of threads posted in each community
          const threadCountPerCommunity = {};
          // accumulate threads posted in the last month keyed by communityid
          threadsPostedInRange.map(c => {
            threadCountPerCommunity[c.communityId] = threadCountPerCommunity[
              c.communityId
            ]
              ? threadCountPerCommunity[c.communityId] + 1
              : 1;
          });
          const activeCommunitiesByThreads = Object.keys(
            threadCountPerCommunity
          ).filter(o => threadCountPerCommunity[o] >= MIN_THREAD_COUNT);

          // communities that meet a minimum membership threshold
          const activeCommunitiesByMembership = getCommunitiesWithMinimumMembers(
            MIN_MEMBER_COUNT,
            index
          );

          return Promise.all([
            activeCommunitiesByThreads,
            activeCommunitiesByMembership,
          ]).then(([activeCommunitiesByThreads, activeByMembership]) => {
            const activeCommunitiesByMembership = activeByMembership.map(
              c => c.id
            );

            const intersection = (a, b) => {
              let ai = 0,
                bi = 0;
              let result = [];

              while (ai < a.length && bi < b.length) {
                if (a[ai] < b[bi]) {
                  ai++;
                } else if (a[ai] > b[bi]) {
                  bi++;
                } else {
                  /* they're equal */
                  result.push(a[ai]);
                  ai++;
                  bi++;
                }
              }

              return result;
            };

            // find communities that met both thread and membership criteria
            const activeCommunities = intersection(
              activeCommunitiesByThreads,
              activeCommunitiesByMembership
            );

            return activeCommunities.length;
          });
        });
      };

      const getCount = (table, filter, index, field) => {
        if (filter) {
          return r
            .table(table)
            .filter(filter)
            .filter(
              r
                .row(field)
                .during(
                  r.now().sub(60 * 60 * 24 * 365),
                  r.now().sub(60 * 60 * 24 * index)
                )
            )
            .filter(row => r.not(row.hasFields('deletedAt')))
            .count()
            .run(conn);
        }

        return r
          .table(table)
          .filter(row => r.not(row.hasFields('deletedAt')))
          .count()
          .run(conn);
      };

      // cpu, tpu, mpu
      const getPu = (table, index) => {
        return getCount('users', null, index, 'createdAt')
          .then(userCount => {
            const tableCount = r
              .table(table)
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
      const arr = Array.apply(null, { length: 30 }).map(() => 0);
      const backfill = arr.map((o, i) => {
        const dau = getAu('daily', i);
        const wau = getAu('weekly', i);
        const mau = getAu('monthly', i);
        const dac = getAc('daily', i);
        const wac = getAc('weekly', i);
        const mac = getAc('monthly', i);
        const cpu = getPu('usersCommunities', i);
        const mpu = getPu('messages', i);
        const tpu = getPu('threads', i);
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
          dau,
          wau,
          mau,
          dac,
          wac,
          mac,
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
              dau,
              wau,
              mau,
              dac,
              wac,
              mac,
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
              dau,
              wau,
              mau,
              dac,
              wac,
              mac,
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
