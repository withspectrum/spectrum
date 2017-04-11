/**
 * Storing and retrieving messages
 */
const { db } = require('./db');

const getMessage = id => {
  const { connection } = require('./db');
  return db.table('messages').get(id).run(connection);
};

const getMessagesByStory = story => {
  const { connection } = require('./db');
  return db.table('messages').filter({ story }).run(connection).then(
    cursor =>
      new Promise(resolve => {
        cursor.toArray((err, result) => {
          if (err) throw err;
          resolve(result);
        });
      })
  );
};

const storeMessage = message => {
  const { connection } = require('./db');
  // Insert a message
  return db
    .table('messages')
    .insert(
      Object.assign({}, message, {
        timestamp: new Date(),
      }),
      { returnChanges: true }
    )
    .run(connection)
    .then(result => result.changes[0].new_val);
};

const listenToNewMessages = cb => {
  const { connection } = require('./db');
  return (
    db
      .table('messages')
      .changes({
        includeInitial: false,
      })
      // Filter to only include newly inserted messages in the changefeed
      .filter(
        db.row('old_val').eq(null).and(db.not(db.row('new_val').eq(null)))
      )
      .run(connection, (err, cursor) => {
        if (err) throw err;
        cursor.each((err, data) => {
          if (err) throw err;
          // Call the passed callback with the message directly
          cb(data.new_val);
        });
      })
  );
};

module.exports = {
  getMessage,
  getMessagesByStory,
  storeMessage,
  listenToNewMessages,
};
