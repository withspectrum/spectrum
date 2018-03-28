exports.up = async (r, conn) => {
  const addFields = r
    .table('communities')
    .update({
      // a distinct email for each community where receipts and admin
      // messages will be sent, can be different from the owner's personal
      // email
      administratorEmail: null,
      // references the actual creator of the community, discrete from the 'owner'
      // role
      creatorId: null,
      // will be used to fetch records from the stripeCustomers and stripeInvoices
      // tables in order to populate the billing area and resolve query fields
      // for community features
      stripeCustomerId: null,
      // these are two feature flags that pluto will listen to changes for in
      // order to trigger billing events
      analyticsEnabled: false,
      prioritySupportEnabled: false,
    })
    .run(conn);

  // gets all the owner records in a community, figures out which one is the oldest,
  // then uses that record to populate an administratorEmail and creatorId field
  // if they exist
  const oldestOwners = await r
    .table('usersCommunities')
    .filter({ isOwner: true })
    .group('communityId')
    .ungroup()
    .map(row => row('reduction'))
    .map(row => row.min('createdAt'))
    .eqJoin('userId', r.table('users'))
    .zip()
    .run(conn)
    .then(cursor => cursor.toArray());

  const setAdminFields = oldestOwners.map(async owner => {
    if (!owner || !owner.userId || !owner.communityId) return;
    return await r
      .table('communities')
      .get(owner.communityId)
      .update({
        administratorEmail: owner.email,
        creatorId: owner.userId,
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
    .update({
      administratorEmail: r.literal(),
      creatorId: r.literal(),
      stripeCustomerId: r.literal(),
      analyticsEnabled: r.literal(),
      prioritySupportEnabled: r.literal(),
    })
    .run(conn);
};
