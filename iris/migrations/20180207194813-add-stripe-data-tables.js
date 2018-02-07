require('now-env');

exports.up = function(r, conn) {
  const createCustomersTable = () =>
    r.tableCreate('stripeCustomers', { primaryKey: 'customerId' }).run(conn);

  const createSubscriptionsTable = () =>
    r
      .tableCreate('stripeSubscriptions', { primaryKey: 'customerId' })
      .run(conn);

  const createChargesTable = () =>
    r.tableCreate('stripeCharges', { primaryKey: 'customerId' }).run(conn);

  const createInvoicesTable = () =>
    r.tableCreate('stripeInvoices', { primaryKey: 'customerId' }).run(conn);

  const createSourcesTable = () =>
    r.tableCreate('stripeSources', { primaryKey: 'customerId' }).run(conn);

  return Promise.all([
    createCustomersTable(),
    createSubscriptionsTable(),
    createChargesTable(),
    createInvoicesTable(),
    createSourcesTable(),
  ]).catch(err => console.log(err));
};

exports.down = function(r, conn) {
  // Not spending any time undoing this
  return Promise.all([
    r.tableDrop('stripeCustomers').run(conn),
    r.tableDrop('stripeSubscriptions').run(conn),
    r.tableDrop('stripeCharges').run(conn),
    r.tableDrop('stripeInvoices').run(conn),
    r.tableDrop('stripeSources'.run(conn)),
  ]);
};
