import database from 'firebase/database';
import { getStory } from './stories';
import { hashToArray } from '../helpers/utils';

/**
 * Create notifications for a bunch of users
 */
export const createNotifications = (
  { users, activityType, sender, content, ids = {} },
) => {
  const db = database();
  let updates = {};
  users.forEach(user => {
    try {
      const { key } = db.ref().child(`notifications/${user}`).push();
      updates[`notifications/${user}/${key}`] = {
        activityType,
        id: key,
        ids,
        sender,
        content,
        timestamp: database.ServerValue.TIMESTAMP,
        read: false,
      };
    } catch (err) {
      // Ignore if sending a notification to a single user fails
      console.log(err);
    }
  });

  return db
    .ref()
    .update(updates)
    // Failing to send a notification shouldn't block the UI from updating
    .catch(err => {
      console.log('Sending notification failed', err);
    });
};

const UNIQUE = (v, i, a) => a.indexOf(v) === i;

/**
 * Listen to new notifications
 */
export const listenToNewNotifications = (userId, cb) => {
  const db = database();

  const handle = snapshot => {
    const notification = snapshot.val();
    if (!notification) return;
    getStory(notification.ids.story).then(story => {
      if (story && !story.deleted) return cb(notification);
      // If we have an old notification for a deleted story get rid of it
      db.ref(`notifications/${userId}/${notification.id}`).remove();
    });
  };

  // Handle adding of unread notifications
  db
    .ref(`notifications/${userId}`)
    .orderByChild('read')
    .equalTo(false)
    .on('child_added', handle);
  // Handle changing of any notifications
  db.ref(`notifications/${userId}`).on('child_changed', handle);
};

/**
 * Get all notifications of a user
 */
export const getNotifications = uid => {
  const db = database();

  return db
    .ref(`notifications/${uid}`)
    .once('value')
    .then(snapshot => hashToArray(snapshot.val()));
};

/**
 * Mark messages of a story read
 */
export const markStoryRead = (storyId, userId) => new Promise(resolve => {
  const db = database();

  db
    .ref(`notifications/${userId}`)
    .orderByChild('ids/story')
    .equalTo(storyId)
    .once('value', snapshot => {
      const storyNotifications = snapshot.val();
      if (!storyNotifications) return;
      let updates = {};
      Object.keys(storyNotifications).forEach(id => {
        updates[`${id}/read`] = true;
      });
      resolve(db.ref(`notifications/${userId}`).update(updates));
    });
});
