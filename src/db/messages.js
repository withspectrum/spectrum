import database from 'firebase/database';
import { getStory } from './stories';
import { getMessageGroup } from './messageGroups';
import { createNotifications } from './notifications';
import { getUserInfo } from './users';
import { ACTIVITY_TYPES } from './types';

const UNIQUE = (v, i, a) => a.indexOf(v) === i;

export const getMessageKey = () => database().ref('messages').push().key;
export const getPrivateMessageKey = () =>
  database().ref('messages_private').push().key;

export const getMessage = messageId => {
  const db = database();

  return db
    .ref(`messages/${messageId}`)
    .once('value')
    .then(snapshot => snapshot.val());
};

export const getMessages = storyId => {
  return getStory(storyId).then(story => {
    if (!story.messages) return Promise.resolve([]);
    const messages = Object.keys(story.messages);
    return Promise.all(messages.map(message => getMessage(message)));
  });
};

export const getPrivateMessage = messageId => {
  const db = database();

  return db
    .ref(`messages_private/${messageId}`)
    .once('value')
    .then(snapshot => {
      return snapshot.val();
    });
};

export const getPrivateMessages = messageGroupId => {
  return getMessageGroup(messageGroupId).then(messageGroup => {
    if (!messageGroup.messages) return Promise.resolve([]);
    const messages = Object.keys(messageGroup.messages);
    return Promise.all(messages.map(message => getPrivateMessage(message)));
  });
};

/**
 * Create a message in the db
 *
 * Resolves the returned promise with the created message data
 */
export const createMessage = ({ storyId, frequency, user, message, key }) => {
  const db = database();

  const id = key || db.ref('messages').push().key;

  return db
    .ref()
    .update({
      [`messages/${id}`]: {
        id,
        storyId,
        frequencyId: frequency.id,
        timestamp: database.ServerValue.TIMESTAMP,
        userId: user.uid,
        message,
      },
      [`stories/${storyId}/last_activity`]: database.ServerValue.TIMESTAMP,
      [`stories/${storyId}/participants/${user.uid}`]: {
        id: user.uid,
        last_activity: database.ServerValue.TIMESTAMP,
      },
      [`stories/${storyId}/messages/${id}`]: {
        id,
      },
    })
    .then(() => db.ref(`stories/${storyId}`).once('value'))
    .then(snapshot => snapshot.val())
    .then(story => {
      return getMessages(storyId).then(messages => {
        createNotifications({
          // Add notifications for
          users: messages
            // - Everybody who's sent a message in that story before
            .map(({ userId }) => userId)
            // - Creator of story
            .concat([story.creator.uid])
            .filter(UNIQUE)
            // Avoid notifying the sender
            .filter(uid => uid !== user.uid),
          activityType: ACTIVITY_TYPES.NEW_MESSAGE,
          ids: {
            frequency: frequency.id,
            story: storyId,
          },
          sender: {
            uid: user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL,
          },
          content: message.type === 'text'
            ? message.content.substr(0, 140)
            : '',
        });
      });
    })
    .then(() => db.ref(`messages/${id}`).once('value'))
    .then(snapshot => snapshot.val());
};

/**
 * Create a message in the db
 *
 * Resolves the returned promise with the created message data
 */
export const createPrivateMessage = (
  { messageGroupId, user, message, key },
) => {
  const db = database();

  const id = key || db.ref('messages_private').push().key;

  return db
    .ref()
    .update({
      [`messages_private/${id}`]: {
        id,
        messageGroupId,
        timestamp: database.ServerValue.TIMESTAMP,
        userId: user.uid,
        message,
      },
      [`message_groups/${messageGroupId}/last_activity`]: database.ServerValue.TIMESTAMP,
      [`message_groups/${messageGroupId}/messages/${id}`]: {
        id,
      },
    })
    .then(() => db.ref(`message_groups/${messageGroupId}`).once('value'))
    .then(snapshot => snapshot.val())
    .then(messageGroup => {
      // TODO: Notifications logic
      // return getPrivateMessages(messageGroupId).then(messages => {
      //   createNotifications({
      //     // Add notifications for
      //     users: messages
      //       // - Everybody who's sent a message in that story before
      //       .map(({ userId }) => userId)
      //       // - Creator of story
      //       .concat([story.creator.uid])
      //       .filter(UNIQUE)
      //       // Avoid notifying the sender
      //       .filter(uid => uid !== user.uid),
      //     activityType: ACTIVITY_TYPES.NEW_MESSAGE,
      //     ids: {
      //       frequency: frequency.id,
      //       story: storyId,
      //     },
      //     sender: {
      //       uid: user.uid,
      //       displayName: user.displayName,
      //       photoURL: user.photoURL,
      //     },
      //     content: message.type === 'text'
      //       ? message.content.substr(0, 140)
      //       : '',
      //   });
      // });
    })
    .then(() => db.ref(`messages_private/${id}`).once('value'))
    .then(snapshot => snapshot.val());
};

export const createReaction = ({ messageId, uid }) => {
  const db = database();

  const TYPE = 'like';

  return db
    .ref()
    .update({
      [`messages/${messageId}/reactions/${uid}`]: {
        type: TYPE,
        timestamp: database.ServerValue.TIMESTAMP,
      },
    })
    .then(() => Promise.all([getMessage(messageId), getUserInfo(uid)]))
    .then(([message, user]) => {
      createNotifications({
        users: [message.userId],
        activityType: ACTIVITY_TYPES.REACTION,
        ids: {
          frequency: message.frequencyId,
          story: message.storyId,
        },
        sender: {
          uid,
          displayName: user.displayName,
          photoURL: user.photoURL,
        },
        content: TYPE,
      });
    });
};

export const deleteReaction = ({ messageId, uid }) => {
  const db = database();

  return db.ref(`/messages/${messageId}/reactions/${uid}`).remove();
};
