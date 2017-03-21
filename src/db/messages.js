import * as firebase from 'firebase';
import { getStory } from './stories';
import { createNotifications } from './notifications';
import { ACTIVITY_TYPES } from './types';

const UNIQUE = (v, i, a) => a.indexOf(v) === i;

export const getMessageKey = () =>
  firebase.database().ref('messages').push().key;

export const getMessage = messageId => {
  const db = firebase.database();

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

/**
 * Create a message in the db
 *
 * Resolves the returned promise with the created message data
 */
export const createMessage = ({ storyId, frequency, user, message, key }) => {
  const db = firebase.database();

  const id = key || db.ref('messages').push().key;

  return db
    .ref()
    .update({
      [`messages/${id}`]: {
        id,
        storyId,
        frequencyId: frequency.id,
        timestamp: firebase.database.ServerValue.TIMESTAMP,
        userId: user.uid,
        message,
      },
      [`stories/${storyId}/last_activity`]: firebase.database.ServerValue.TIMESTAMP,
      [`stories/${storyId}/participants/${user.uid}`]: {
        id: user.uid,
        last_activity: firebase.database.ServerValue.TIMESTAMP,
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
