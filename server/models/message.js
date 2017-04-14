/**
 * Storing and retrieving messages
 */
const { db } = require('./db');

const getMessage = (location, id) => {
  return db.table(location).get(id).run();
};

const getMessagesByLocationAndThread = (location, thread) => {
  return db.table(location).filter({ thread }).run();
};

const storeMessage = (location, message) => {
  // Insert a message
  return db
    .table(location)
    .insert(
      Object.assign({}, message, {
        timestamp: new Date(),
      }),
      { returnChanges: true }
    )
    .run()
    .then(result => result.changes[0].new_val);
};

const listenToNewMessages = (location, cb) => {
  return (
    db
      .table(location)
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
  getMessagesByLocationAndThread,
  storeMessage,
  listenToNewMessages,
};
