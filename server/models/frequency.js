const { db } = require('./db');

const getAllFrequencies = () => {
  const { connection } = require('./db');
  return db.table('frequencies').run(connection).then(
    cursor => new Promise(resolve => {
      cursor.toArray((err, result) => {
        if (err) throw err;
        resolve(result);
      });
    }),
  );
};

const getFrequency = id => {
  const { connection } = require('./db');
  return db.table('frequencies').get(id).run(connection);
};

module.exports = {
  getAllFrequencies,
  getFrequency,
};
