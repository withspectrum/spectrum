import * as firebase from 'firebase';
import { getStory } from './stories';
import { createNotifications } from './notifications';
import { ACTIVITY_TYPES } from './types';
import { hashToArray } from '../helpers/utils';

const UNIQUE = (v, i, a) => a.indexOf(v) === i;

/**
 * Create a message in the db
 *
 * Resolves the returned promise with the created message data
 */
export const createMessage = ({ storyId, frequency, user, message }) => {
  const db = firebase.database();

  const key = db.ref('messages').push().key;
  let notified = [];

  return db
    .ref()
    .update({
      [`messages/${key}`]: {
        id: key,
        storyId,
        frequencyId: frequency.id,
        timestamp: firebase.database.ServerValue.TIMESTAMP,
        userId: user.uid,
        message: message,
      },
      [`stories/${storyId}/last_activity`]: firebase.database.ServerValue.TIMESTAMP,
      [`stories/${storyId}/messages/${key}`]: {
        id: key,
      },
    })
    .then(() => db.ref(`stories/${storyId}`).once('value'))
    .then(snapshot => snapshot.val())
    .then(story => {
      return getMessages(storyId).then(messages => {
        notified = messages
          // - Everybody who's sent a message in that story before
          .map(({ userId }) => userId)
          // - Creator of story
          .concat([story.creator.uid])
          .filter(UNIQUE)
          // Avoid notifying the sender
          .filter(uid => uid !== user.uid);
        createNotifications({
          // Add notifications for
          users: notified,
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
    .then(() => {
      if (message.type !== 'draft-js') return Promise.resolve();
      // Get all mentions
      const mentions = hashToArray(message.content.entityMap).filter(entity => {
        if (entity.type === 'mention') return true;
        return false;
      });

      return createNotifications({
        // Add notifications for mentions
        users: mentions
          // Get the uids of all mentions
          .map(mention => mention.data.mention.get('uid'))
          .filter(UNIQUE)
          // Avoid notifying the sender
          .filter(uid => uid !== user.uid)
          // Avoid notifying people who've already been notified of this message
          .filter(uid => notified.indexOf(uid) === -1),
        activityType: ACTIVITY_TYPES.MENTION,
        ids: {
          frequency: frequency.id,
          story: storyId,
        },
        sender: {
          uid: user.uid,
          displayName: user.displayName,
          photoURL: user.photoURL,
        },
        content: message.type === 'text' ? message.content.substr(0, 140) : '',
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
