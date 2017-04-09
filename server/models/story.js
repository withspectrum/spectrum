const { db } = require('./db');

const getAllStories = () => {
  const { connection } = require('./db');
  return db.table('stories').run(connection).then(
    cursor => new Promise(resolve => {
      cursor.toArray((err, result) => {
        if (err) throw err;
        resolve(result);
      });
    }),
  );
};

module.exports = {
  getAllStories,
};
