exports.up = function(r, conn) {
  // get all recurring payments
  return r
    .table('recurringPayments')
    .run(conn)
    .then(cursor => cursor.toArray())
    .then(subscriptions => {
      // for each subscription record, map it and create a new object with a cleaner data model
      return subscriptions.map(subscription => {
        return Object.assign(
          {},
          {
            id: subscription.id,
            // userId is used to keep track of who is making payments for any subscription it is also queries against to determine if a user isPro
            userId: subscription.userId,
            // communityId is queried against to determine if a community isPro
            communityId: subscription.communityId,
            customerId: subscription.stripeData.customer,
            subscriptionId: subscription.stripeData.id,
            // planId and planName will determine if the user is paying for a Pro user account or for an upgraded community
            planId: subscription.stripeData.plan.id,
            planName: subscription.stripeData.plan.name,
            amount: subscription.stripeData.plan.amount,
            // rather than having multiple plans on Stripe for every possible tier of upgraded community, we can instead just stack quantities - so an upgraded community with 9k members would have a single 'pro community' record with 9 quantity that determines how much they will be billed every month
            // when rendering subscriptions in the client, the quantity should be multiplied by the amount to determine the total cost of the subscription
            quantity: subscription.stripeData.quantity,
            // will be used to determine the current state of an isPro query against a user or community. When a community or user gets downgraded this field will switch from 'active' to 'canceled'
            status: subscription.stripeData.status,
            // the following field dates will be used for client side rendering - we will need to implement webhooks to keep the currentPeriodStart and currentPeriodEnd timestamps up to date
            currentPeriodStart: subscription.stripeData.current_period_start,
            currentPeriodEnd: subscription.stripeData.current_period_end,
            createdAt: subscription.stripeData.plan.created,
          }
        );
      });
    })
    .then(cleanSubscriptions => {
      return Promise.all([
        cleanSubscriptions,
        // delete all the old records in recurringPayments table
        r.table('recurringPayments').delete().run(conn),
        // also create a new index against communityId for faster isPro lookups on communities
        r.table('recurringPayments').indexCreate('communityId').run(conn),
      ]);
    })
    .then(([cleanSubscriptions]) => {
      // insert each new clean record into the table
      return cleanSubscriptions.map(subscription => {
        return r
          .table('recurringPayments')
          .insert({ ...subscription })
          .run(conn);
      });
    });
};

exports.down = function(r, conn) {
  return Promise.resolve();
};
