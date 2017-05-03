//@flow

/**
 * Storing and retrieving messages
 */
const { db } = require('./db');
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

const storeMessage = (location: LocationTypes, message: MessageProps, user) => {
  // Insert a message
  return db
    .table(location)
    .insert(
      Object.assign({}, message, {
        timestamp: new Date(),
        sender: user.uid,
      }),
      { returnChanges: true }
    )
    .run()
    .then(result => result.changes[0].new_val);
};

const listenToNewMessages = (location: LocationTypes, cb: Function): Object => {
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
