/**
 * Database setup is done here
 */
const r = require('rethinkdb');

const main = {
  db: r,
  connection: null,
};

main.init = ({ host, port }) =>
  main.db.connect({ host, port }).then(connection => {
    connection.use('spectrum');
    main.connection = connection;
    return connection;
  });

module.exports = main;
