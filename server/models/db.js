const r = require('rethinkdb');

const main = {
  db: r,
  connection: null,
};

main.init = ({ host, port }) =>
  main.db.connect({ host, port }).then(connection => {
    main.connection = connection;
    return connection;
  });

module.exports = main;
