//@flow

/**
 * Storing and retrieving messages
 */
const { db } = require('./db');
const { listenToNewDocumentsIn } = require('./utils');
const { storeMessageNotification } = require('./notification');
import type { PaginationOptions } from '../utils/paginate-arrays';

export type MessageTypes = 'text' | 'media';
export type MessageProps = {
  type: MessageTypes,
  content: String,
};

const getMessage = (id: string) => {
  return db.table('messages').get(id).run();
};

const getMessages = (thread: String) => {
  return db
    .table('messages')
    .getAll(thread, { index: 'thread' })
    .orderBy(db.asc('timestamp'))
    .run();
};

const storeMessage = (message: MessageProps, user) => {
  // Insert a message
  return db
    .table('messages')
    .insert(
      Object.assign({}, message, {
        timestamp: new Date(),
        sender: user.uid,
      }),
      { returnChanges: true }
    )
    .run()
    .then(result => result.changes[0].new_val)
    .then(message => {
      storeMessageNotification({
        message: message.id,
        story: message.thread,
        sender: message.sender,
        content: {
          excerpt: message.message.content,
        },
      });
      console.log('made it here with ', message);
      return message;
    });
};

const listenToNewMessages = (cb: Function) => {
  return listenToNewDocumentsIn('messages', cb);
};

const getMessageCount = (thread: string) => {
  return db.table('messages').getAll(thread, { index: 'thread' }).count().run();
};

module.exports = {
  getMessage,
  getMessages,
  storeMessage,
  listenToNewMessages,
  getMessageCount,
};
