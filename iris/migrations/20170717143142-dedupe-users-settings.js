exports.up = function(r, conn) {
  return Promise.all([r.tableCreate('usersSettingsUnique').run(conn)])
    .then(() => {
      return r
        .table('usersSettingsUnique')
        .insert(r.table('usersSettings').without('id').distinct())
        .run(conn);
    })
    .then(() => {
      return r.tableDrop('usersSettings').run(conn);
    })
    .then(() => {
      return r.tableCreate('usersSettings').run(conn);
    })
    .then(() => {
      return r
        .table('usersSettings')
        .insert(r.table('usersSettingsUnique').without('id').distinct())
        .run(conn);
    })
    .then(() => {
      return r.tableDrop('usersSettingsUnique').run(conn);
    });
};

exports.down = function(r, conn) {
  return Promise.resolve();
};
