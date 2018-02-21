require('now-env');

// creates a new field on channels which indicates it is read-only, which
// is much easier to write logic around than our current method of always
// checking to see a communities payments status before determining the
// writeability of a channel
exports.up = function(r, conn) {
  return Promise.all([
    r
      .table('channels')
      .update({
        isArchived: false,
      })
      .run(conn),
  ]).catch(err => console.log(err));
};

exports.down = function(r, conn) {
  return Promise.all([
    r
      .table('channels')
      .update({ isArchived: r.literal() })
      .run(conn),
  ]);
};
