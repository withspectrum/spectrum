import * as firebase from 'firebase';
import { getStory } from './stories';
import { createNotifications } from './notifications';
import { ACTIVITY_TYPES, OBJECT_TYPES } from './types';

/**
 * Create a message in the db
 *
 * Resolves the returned promise with the created message data
 */
export const createMessage = ({ storyId, frequency, user, message }) => {
  const db = firebase.database();

  const key = db.ref('messages').push().key;

  console.log('message info:', storyId, frequency, user, message);

  return db
    .ref()
    .update({
      [`messages/${key}`]: {
        id: key,
        storyId,
        frequencyId: frequency.id,
        timestamp: firebase.database.ServerValue.TIMESTAMP,
        userId: user.uid,
        message,
      },
      [`stories/${storyId}/messages/${key}`]: {
        id: key,
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
            // Avoid duplicates
            .filter((v, i, a) => a.indexOf(v) === i)
            // Avoid notifying the sender
            .filter(uid => uid !== user.uid),
          activityType: ACTIVITY_TYPES.NEW_MESSAGE,
          objectType: OBJECT_TYPES.STORY,
          objectId: storyId,
          objectUrl: `/~${frequency.slug || frequency.id}/${storyId}`,
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
    if (!story.messages) return Promise.resolve([]);
    const messages = Object.keys(story.messages);
    return Promise.all(messages.map(message => getMessage(message)));
  });
};
