import * as firebase from 'firebase';
import { getStory } from './stories';
import { createNotifications } from './notifications';
import { ACTIVITY_TYPES, OBJECT_TYPES } from './types';

/**
 * Create a message in the db
 *
 * Resolves the returned promise with the created message data
 */
export const createMessage = ({ storyId, frequency, userId, message }) => {
  const db = firebase.database();

  const key = db.ref('messages').push().key;

  return db
    .ref()
    .update({
      [`messages/${key}`]: {
        id: key,
        storyId,
        frequencyId: frequency.id,
        timestamp: firebase.database.ServerValue.TIMESTAMP,
        userId,
        message,
      },
      [`stories/${storyId}/messages/${key}`]: {
        id: key,
      },
    })
    .then(() => db.ref(`messages/${key}`).once('value'))
    .then(snapshot => {
      const data = snapshot.val();
      createNotifications({
        // Only add notifications for other users
        users: Object.keys(frequency.users).filter(user => user !== userId),
        activityType: ACTIVITY_TYPES.NEW_MESSAGE,
        objectType: OBJECT_TYPES.STORY,
        objectId: storyId,
        objectUrl: `https://spectrum.chat/~${frequency.slug ||
          frequency.id}/${storyId}`,
        senderId: userId,
      });
      return data;
    });
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
    if (!story.messages) return Promise.resolve([]);
    const messages = Object.keys(story.messages);
    return Promise.all(messages.map(message => getMessage(message)));
  });
};
