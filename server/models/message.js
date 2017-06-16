//@flow
import striptags from 'striptags';
const { db } = require('./db');
// $FlowFixMe
const { createQueue } = require('./utils');
const messageNotificationQueue = createQueue('message notification');
const { listenToNewDocumentsIn } = require('./utils');
const { setThreadLastActive } = require('./thread');
import type { PaginationOptions } from '../utils/paginate-arrays';

export type MessageTypes = 'text' | 'media';

const getMessage = (messageId: string): Promise<Object> => {
  return db.table('messages').get(messageId).run();
};

const getMessages = (threadId: String): Promise<Array<Object>> => {
  return db
    .table('messages')
    .between([threadId, db.minval], [threadId, db.maxval], {
      index: 'threadIdAndTimestamp',
    })
    .orderBy({ index: 'threadIdAndTimestamp' })
    .run();
};

const getLastMessage = (threadId: string): Promise<Object> => {
  return db
    .table('messages')
    .getAll(threadId, { index: 'threadId' })
    .max('timestamp')
    .run();
};

const getMediaMessagesForThread = (
  threadId: String
): Promise<Array<Object>> => {
  return getMessages(threadId).then(messages =>
    messages.filter(({ messageType }) => messageType === 'media')
  );
};

const storeMessage = (message: Object, userId: string): Promise<Object> => {
  // Insert a message
  return db
    .table('messages')
    .insert(
      Object.assign({}, message, {
        timestamp: new Date(),
        senderId: userId,
        content: {
          body: striptags(message.content.body),
        },
      }),
      { returnChanges: true }
    )
    .run()
    .then(result => result.changes[0].new_val)
    .then(message => {
      messageNotificationQueue.add({
        message,
        userId,
      });

      if (message.threadType === 'story') {
        setThreadLastActive(message.threadId, message.timestamp);
      }

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
  getLastMessage,
  getMediaMessagesForThread,
  storeMessage,
  listenToNewMessages,
  getMessageCount,
};
