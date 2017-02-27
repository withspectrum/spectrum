import * as firebase from 'firebase';
import { getStory } from './stories';

/**
 * Create a message in the db
 *
 * Resolves the returned promise with the created message data
 */
export const createMessage = ({ storyId, frequencyId, userId, message }) => {
  const db = firebase.database();

  const key = db.ref('messages').push().key;

  return db
    .ref()
    .update({
      [`messages/${key}`]: {
        id: key,
        storyId,
        frequencyId,
        timestamp: firebase.database.ServerValue.TIMESTAMP,
        userId,
        message,
      },
      [`stories/${storyId}/messages/${key}`]: {
        id: key,
      },
    })
    .then(() => db.ref(`messages/${key}`).once('value'))
    .then(snapshot => snapshot.val());
};

export const getMessage = messageId => {
  const db = firebase.database();

  return db
    .ref(`messages/${messageId}`)
    .once('value')
    .then(snapshot => snapshot.val());
};

export const getMessages = storyId => {
  return getStory(storyId).then(story => {
    const messages = Object.keys(story.messages);
    return Promise.all(messages.map(message => getMessage(message)));
  });
};
