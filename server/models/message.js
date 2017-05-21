//@flow
const { db } = require('./db');
const { listenToNewDocumentsIn } = require('./utils');
const { storeMessageNotification } = require('./notification');
import type { PaginationOptions } from '../utils/paginate-arrays';

export type MessageTypes = 'text' | 'media';

const getMessage = (messageId: string): Promise<Object> => {
  return db.table('messages').get(messageId).run();
};

const getMessages = (threadId: String): Promise<Array<Object>> => {
  return db
    .table('messages')
    .getAll(threadId, { index: 'threadId' })
    .orderBy(db.asc('timestamp'))
    .run();
};

const storeMessage = (message, user: Object): Promise<Object> => {
  // Insert a message
  return db
    .table('messages')
    .insert(
      Object.assign({}, message, {
        timestamp: new Date(),
        senderId: user.id,
      }),
      { returnChanges: true }
    )
    .run()
    .then(result => result.changes[0].new_val)
    .then(message => {
      storeMessageNotification({
        message: message.id,
        threadId: message.threadId,
        senderId: message.senderId,
        content: {
          excerpt: message.content.body,
        },
      });
      return message;
    });
};

const listenToNewMessages = (cb: Function): Function => {
  return listenToNewDocumentsIn('messages', cb);
};

const getMessageCount = (threadId: string): Promise<number> => {
  return db
    .table('messages')
    .getAll(threadId, { index: 'threadId' })
    .count()
    .run();
};

module.exports = {
  getMessage,
  getMessages,
  storeMessage,
  listenToNewMessages,
  getMessageCount,
};
