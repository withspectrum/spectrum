exports.up = function(r, conn) {
  return r
    .tableCreate('threadTags')
    .run(conn)
    .then(() => {
      return r
        .table('threadTags')
        .indexCreate('communityId')
        .run(conn);
    });
};

exports.down = function(r, conn) {
  return r.tableDrop('threadTags').run(conn);
};
