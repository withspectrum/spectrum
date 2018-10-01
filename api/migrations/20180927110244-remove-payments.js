exports.up = async (r, conn) => {
  const betaSupporterIds = await r
    .db('spectrum')
    .table('recurringPayments')
    .filter({ planId: 'beta-pro' })
    .map(row => row('userId'))
    .run(conn)
    .then(cursor => cursor.toArray());

  const addSupporterFieldToUsersPromises = async () =>
    await r
      .db('spectrum')
      .table('users')
      .getAll(...betaSupporterIds)
      .update({
        betaSupporter: true,
      })
      .run(conn);

  const cleanCommunitiesModel = () =>
    r
      .table('communities')
      .update({
        stripeCustomerId: r.literal(),
        analyticsEnabled: r.literal(),
        prioritySupportEnabled: r.literal(),
        ossVerified: r.literal(),
      })
      .run(conn);

  return await Promise.all([
    cleanCommunitiesModel(),
    addSupporterFieldToUsersPromises(),
  ]);
};

exports.down = async (r, conn) => {
  return await Promise.all([
    r
      .db('spectrum')
      .table('communities')
      .update({
        stripeCustomerId: null,
        analyticsEnabled: false,
        prioritySupportEnabled: false,
        ossVerified: false,
      })
      .run(conn),
    r
      .db('spectrum')
      .table('users')
      .update({
        betaSupporter: r.literal(),
      })
      .run(conn),
  ]);
};
