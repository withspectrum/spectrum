const { db } = require('./db');

const getMessage = id => {
  const { connection } = require('./db');
  return db.table('messages').get(id).run(connection);
};

const getMessagesByStory = story => {
  const { connection } = require('./db');
  return db.table('messages').filter({ story }).run(connection).then(
    cursor => new Promise(resolve => {
      cursor.toArray((err, result) => {
        if (err) throw err;
        resolve(result);
      });
    }),
  );
};

module.exports = {
  getMessage,
  getMessagesByStory,
};
