require('now-env');

exports.up = function(r, conn) {
  const createCustomersTable = () =>
    r.tableCreate('stripeCustomers', { primaryKey: 'customerId' }).run(conn);
  const createSubscriptionsTable = () =>
    r
      .tableCreate('stripeSubscriptions', { primaryKey: 'subscriptionId' })
      .run(conn);
  const createChargesTable = () =>
    r.tableCreate('stripeCharges', { primaryKey: 'chargeId' }).run(conn);
  const createInvoicesTable = () =>
    r.tableCreate('stripeInvoices', { primaryKey: 'invoiceId' }).run(conn);
  const createSourcesTable = () =>
    r.tableCreate('stripeSources', { primaryKey: 'sourceId' }).run(conn);

  return Promise.all([
    createCustomersTable(),
    createSubscriptionsTable(),
    createChargesTable(),
    createInvoicesTable(),
    createSourcesTable(),
  ])
    .then(() =>
      Promise.all([
        r
          .table('stripeSubscriptions')
          .indexCreate('customerId')
          .run(conn),
        r
          .table('stripeCharges')
          .indexCreate('customerId')
          .run(conn),
        r
          .table('stripeInvoices')
          .indexCreate('customerId')
          .run(conn),
        r
          .table('stripeSources')
          .indexCreate('customerId')
          .run(conn),
      ])
    )
    .catch(err => console.log(err));
};

exports.down = function(r, conn) {
  // Not spending any time undoing this
  return Promise.all([
    r.tableDrop('stripeCustomers').run(conn),
    r.tableDrop('stripeSubscriptions').run(conn),
    r.tableDrop('stripeCharges').run(conn),
    r.tableDrop('stripeInvoices').run(conn),
    r.tableDrop('stripeSources').run(conn),
  ]);
};
