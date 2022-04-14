exports.up = function(r, conn) {
  return Promise.all([
    r
      .table('usersSettings')
      .run(conn)
      .then(cursor => cursor.toArray())
      .then(settings => {
        return settings.map(setting => {
          return Object.assign(
            {},
            {
              ...setting,
              notifications: {
                types: {
                  newMessageInThreads: {
                    email: setting.notifications.types.newMessageInThreads
                      ? setting.notifications.types.newMessageInThreads.email
                      : true,
                  },
                  newThreadCreated: {
                    email: setting.notifications.types.newThreadCreated
                      ? setting.notifications.types.newThreadCreated.email
                      : true,
                  },
                  newDirectMessage: {
                    email: setting.notifications.types.newDirectMessage
                      ? setting.notifications.types.newDirectMessage.email
                      : true,
                  },
                  weeklyDigest: {
                    email: true,
                  },
                  dailyDigest: {
                    email: true,
                  },
                },
              },
            }
          );
        });
      })
      .then(newSettings => {
        return Promise.all([
          newSettings,
          // delete all the old records
          r
            .table('usersSettings')
            .delete()
            .run(conn),
        ]);
      })
      .then(([newSettings]) => {
        // insert each new clean record into the table
        return newSettings.map(setting => {
          return r
            .table('usersSettings')
            .insert({ ...setting })
            .run(conn);
        });
      })
      .catch(err => {
        console.log(err);
        throw err;
      }),
  ]);
};

exports.down = function(r, conn) {
  return Promise.resolve();
};
