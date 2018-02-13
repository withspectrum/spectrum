exports.up = async (r, conn) => {
  const addFields = r
    .table('communities')
    .update({
      administratorEmail: null,
      administratorId: null,
      stripeCustomerId: null,
    })
    .run(conn);

  const oldestOwners = await r
    .table('usersCommunities')
    .filter({ isOwner: true })
    .group('communityId')
    .ungroup()
    .map(row => row('reduction'))
    .map(row => row.min('createdAt'))
    .eqJoin('userId', r.db('spectrum').table('users'))
    .zip()
    .run(conn)
    .then(cursor => cursor.toArray());

  const setAdminFields = oldestOwners.map(async owner => {
    return await r
      .table('communities')
      .get(owner.communityId)
      .update({
        administratorEmail: owner.email,
        administratorId: owner.userId,
      })
      .run(conn);
  });

  return Promise.all([addFields]).then(
    async () => await Promise.all(setAdminFields)
  );
};

exports.down = function(r, conn) {
  return r
    .table('communities')
    .update({ administratorEmail: r.literal(), administratorId: r.literal() })
    .run(conn);
};
