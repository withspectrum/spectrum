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

const storeMessage = message => {
  const { connection } = require('./db');
  return db
    .table('messages')
    .insert(
      Object.assign({}, message, {
        timestamp: new Date(),
      }),
    )
    .run(connection)
    .then(({ generated_keys }) => Promise.all([
      generated_keys[0],
      db
        .table('stories')
        .get(message.story)
        .update({
          messages: db.row('messages').append(generated_keys[0]),
        })
        .run(connection),
    ]))
    .then(([id]) => db.table('messages').get(id).run(connection));
};

module.exports = {
  getMessage,
  getMessagesByStory,
  storeMessage,
};
