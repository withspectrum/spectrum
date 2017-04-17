//@flow

/**
 * Storing and retrieving messages
 */
const { db } = require('./db');

export type LocationTypes = 'messages' | 'direct_messages';
export type MessageTypes = 'text' | 'media';
export type MessageProps = {
  type: MessageTypes,
  content: String,
};

const getMessage = (location: LocationTypes, id: String) => {
  return db.table(location).get(id).run();
};

const getMessagesByLocationAndThread = (
  location: LocationTypes,
  thread: String
) => {
  return db.table(location).filter({ thread }).run();
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

type ReactionProps = {
  message: String,
  user: String,
  type: String,
};

const toggleReaction = (
  location: LocationTypes,
  reaction: ReactionProps
): Object => {
  return db.table(location).get(reaction.message).run((err, data) => {
    const message = data;
    if (message.reactions) {
      // if the message has reactions
      if (message.reactions[reaction.user]) {
        // if the user has left a reaction, remove it
        console.log('attempting to remove...');
        // db.table(location)
        //   .get(reaction.message)('reactions')
        //   .append(reaction)
        //   .run(result => {
        //     console.log('here 1 ', result)
        //   })
        // )
      } else {
        // if the user hasn't left a reaction, add it
        insertReaction(location, reaction);
      }
    } else {
      // otherwise the user is adding the first reaction
      insertFirstReaction(location, reaction);
    }
  });
};

const removeReaction = (location, reaction) => {
  return db
    .table(location)
    .get(reaction.message)('reactions')
    .filter({ user: reaction.user })
    .delete()
    .run(result => {
      console.log('removed reaction');
    });
};

const insertFirstReaction = (location, reaction) => {
  return db
    .table(location)
    .get(reaction.message)
    .update({
      reactions: [{ ...reaction, timestamp: new Date() }],
    })
    .run(result => {
      console.log('first add ', result);
    });
};

const insertReaction = (location, reaction) => {
  return db
    .table(location)
    .get(reaction.message)('reactions')
    .insert(
      Object.assign({}, reaction, {
        timestamp: new Date(),
      }),
      { returnChanges: true }
    )
    .run(result => {
      console.log('here 1 ', result);
    });
};

module.exports = {
  getMessage,
  getMessagesByLocationAndThread,
  storeMessage,
  listenToNewMessages,
  toggleReaction,
};
