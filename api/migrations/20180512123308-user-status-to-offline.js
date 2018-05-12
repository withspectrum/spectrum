exports.up = async (r, conn) => {
  return Promise.all([
    r
      .table('users')
      .update({
        status: 'offline',
      })
      .run(conn),
  ]).catch(err => console.error(err));
};

exports.down = async (r, conn) => {
  return Promise.all([
    r
      .table('users')
      .update({
        status: r.literal(),
      })
      .run(conn),
  ]).catch(err => console.error(err));
};
