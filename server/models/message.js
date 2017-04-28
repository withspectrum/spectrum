//@flow

/**
 * Storing and retrieving messages
 */
const { db } = require('./db');
const { listenToNewDocumentsIn } = require('./utils');
import type { PaginationOptions } from '../utils/paginate-arrays';

export type LocationTypes = 'messages' | 'direct_messages';
export type MessageTypes = 'text' | 'media';
export type MessageProps = {
  type: MessageTypes,
  content: String,
};

const getMessage = (location: LocationTypes, id: string) => {
  return db.table(location).get(id).run();
};

const getMessagesByLocationAndThread = (
  location: LocationTypes,
  thread: String,
  { after, first }: PaginationOptions
) => {
  const getMessages = db
    .table(location)
    .between(after || db.minval, db.maxval, { leftBound: 'open' })
    .orderBy('timestamp')
    .filter({ thread })
    .limit(first)
    .run()
    .then();

  const getLastMessage = db
    .table(location)
    .orderBy('timestamp')
    .filter({ thread })
    .max()
    .default({})
    .run();

  return Promise.all([getMessages, getLastMessage]);
};

const storeMessage = (location: LocationTypes, message: MessageProps) => {
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

const listenToNewMessages = (location: LocationTypes, cb: Function) => {
  return listenToNewDocumentsIn(location, cb);
};

const getMessageCount = (location: string, thread: string) => {
  return db.table(location).filter({ thread }).count().run();
};

module.exports = {
  getMessage,
  getMessagesByLocationAndThread,
  storeMessage,
  listenToNewMessages,
  getMessageCount,
};
