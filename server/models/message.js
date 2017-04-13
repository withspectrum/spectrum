/**
 * Storing and retrieving messages
 */
const { db } = require('./db');
const { listenToNewDocumentsIn } = require('./utils');

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
  return listenToNewDocumentsIn('messages', cb);
};

module.exports = {
  getMessage,
  getMessagesByStory,
  storeMessage,
  listenToNewMessages,
};
