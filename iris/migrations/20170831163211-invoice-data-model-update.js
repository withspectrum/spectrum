exports.up = function(r, conn) {
  // get all recurring payments
  return r
    .table('invoices')
    .run(conn)
    .then(cursor => cursor.toArray())
    .then(invoices => {
      // for each subscription record, map it and create a new object with a cleaner data model
      return invoices.map(invoice => {
        return Object.assign(
          {},
          {
            id: invoice.id,
            amount: invoice.amount,
            chargeId: invoice.stripeData.id,
            communityId: invoice.communityId,
            customerId: null,
            paidAt: invoice.stripeData.created,
            planId: 'community-standard',
            planName: 'Spectrum Standard Community',
            quantity: 1,
            sourceBrand: invoice.stripeData.source.brand,
            sourceLast4: invoice.stripeData.source.last4,
            status: 'paid',
            subscriptionId: null,
            userId: null,
          }
        );
      });
    })
    .then(cleanInvoices => {
      return Promise.all([
        cleanInvoices,
        // delete all the old records in recurringPayments table
        r
          .table('invoices')
          .delete()
          .run(conn),
      ]);
    })
    .then(([cleanInvoices]) => {
      // insert each new clean record into the table
      return cleanInvoices.map(invoice => {
        return r
          .table('invoices')
          .insert(invoice)
          .run(conn);
      });
    });
};

exports.down = function(r, conn) {
  return Promise.resolve();
};
