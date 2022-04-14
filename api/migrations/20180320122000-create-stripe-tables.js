exports.up = function(r, conn) {
  const createCustomersTable = () =>
    r.tableCreate('stripeCustomers', { primaryKey: 'customerId' }).run(conn);
  const createInvoicesTable = () =>
    r.tableCreate('stripeInvoices', { primaryKey: 'invoiceId' }).run(conn);

  return Promise.all([createCustomersTable(), createInvoicesTable()])
    .then(() =>
      Promise.all([
        r
          .table('stripeInvoices')
          .indexCreate('customerId')
          .run(conn),
      ])
    )
    .catch(err => console.log(err));
};

exports.down = function(r, conn) {
  return Promise.all([
    r.tableDrop('stripeCustomers').run(conn),
    r.tableDrop('stripeInvoices').run(conn),
  ]);
};
