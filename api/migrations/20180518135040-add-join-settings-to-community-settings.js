exports.up = async (r, conn) => {
  return r
    .table('communitySettings')
    .update({
      joinSettings: {
        tokenJoinEnabled: false,
        token: null,
      },
    })
    .run(conn);
};

exports.down = function(r, conn) {
  return r
    .table('communitySettings')
    .update({
      joinSettings: r.literal(),
    })
    .run(conn);
};
