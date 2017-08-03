const without = require('lodash/without');
// This is taken from the Babel REPL and is what it transpiles ...arr to.
// (can't use rest/spread in Node yet)
function _toConsumableArray(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
      arr2[i] = arr[i];
    }
    return arr2;
  } else {
    return Array.from(arr);
  }
}

exports.up = function(r, conn) {
  // Get every UserID that has opted out of new message in threads emails
  return (
    r
      .table('usersSettings')
      .filter({
        notifications: {
          types: {
            newMessageInThreads: {
              email: false,
            },
          },
        },
      })
      .map(rec => rec('userId'))
      .distinct()
      .run(conn)
      .then(cursor => cursor.toArray())
      .then(optedOut => {
        return Promise.all([
          optedOut,
          r
            .table('usersSettings')
            .filter({
              notifications: {
                types: {
                  newMessageInThreads: {
                    email: true,
                  },
                },
              },
            })
            .map(rec => rec('userId'))
            .distinct()
            .run(conn)
            .then(cursor => cursor.toArray()),
        ]);
      })
      .then(([optedOut, optedIn]) => {
        return [
          optedOut,
          // Remove userIds that appear in optedOut from optedIn
          without.apply(
            undefined,
            [optedIn].concat(_toConsumableArray(optedOut))
          ),
        ];
      })
      // Drop the usersSettings table
      .then(([optedOut, optedIn]) => {
        return Promise.all([
          optedOut,
          optedIn,
          r.table('usersSettings').delete().run(conn),
        ]);
      })
      .then(([optedOut, optedIn]) => {
        // Insert records of users that have opted out
        const optedOutInsertions = optedOut.map(userId =>
          r
            .table('usersSettings')
            .insert({
              userId,
              notifications: {
                types: {
                  newMessageInThreads: {
                    email: false,
                  },
                },
              },
            })
            .run(conn)
        );
        // Insert records of users that have opted in
        const optedInInsertions = optedIn.map(userId =>
          r
            .table('usersSettings')
            .insert({
              userId,
              notifications: {
                types: {
                  newMessageInThreads: {
                    email: true,
                  },
                },
              },
            })
            .run(conn)
        );
        return Promise.all(
          [].concat(
            _toConsumableArray(optedOutInsertions),
            _toConsumableArray(optedInInsertions)
          )
        );
      })
  );
};

exports.down = function(r, conn) {
  return Promise.resolve();
};
