/**
 * Storing and retrieving messages
 */
const { db } = require('./db');

const getMessage = id => {
  return db.table('messages').get(id).run();
};

const getMessagesByStory = story => {
  return db.table('messages').filter({ story }).run();
};

const storeMessage = message => {
  // Insert a message
  return db
    .table('messages')
    .insert(
      Object.assign({}, message, {
        timestamp: new Date(),
      }),
      { returnChanges: true }
    )
    .run()
    .then(result => result.changes[0].new_val);
};

const listenToNewMessages = cb => {
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
      .run({ cursor: true }, (err, cursor) => {
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
