exports.up = function(r, conn) {
  // create a second table that will store unique-ified usersSettings
  return r
    .tableCreate('usersSettingsUnique')
    .run(conn)
    .then(() => {
      // in the new table, insert distinct records from the original usersSettings table
      return r
        .table('usersSettingsUnique')
        .insert(r.table('usersSettings').without('id').distinct())
        .run(conn);
    })
    .then(() => {
      // delete the old table with duplicate records
      return r.tableDrop('usersSettings').run(conn);
    })
    .then(() => {
      // create a new clean table
      return r.tableCreate('usersSettings').run(conn);
    })
    .then(() => {
      // insert the unique-ified usersSettings records into the now-empty usersSettings table
      return r
        .table('usersSettings')
        .insert(r.table('usersSettingsUnique').without('id').distinct()) // keeping this distinct function just because
        .run(conn);
    })
    .then(() => {
      // remove the now-redundant unique-ified records
      return r.tableDrop('usersSettingsUnique').run(conn);
    });
};

exports.down = function(r, conn) {
  return Promise.resolve();
};
