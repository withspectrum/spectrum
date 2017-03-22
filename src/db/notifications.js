import database from 'firebase/database';
import { getStory } from './stories';

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
 * Listen to notifications
 */
export const listenToNotifications = (userId, cb) => {
  const db = database();

  return db.ref(`notifications/${userId}`).on('value', snapshot => {
    const notifications = snapshot.val();
    if (!notifications) return cb([]);
    const array = Object.keys(notifications).map(id => notifications[id]);
    Promise
      .all(
        array
          .map(notification => notification.ids.story)
          .filter(UNIQUE)
          .map(id => getStory(id).catch(err => {
            return {};
          })),
      )
      .then(stories => {
        console.log(stories);
        cb(
          array.filter(notification => {
            const story = stories.find(
              story => notification.ids.story === story.id,
            );
            return story && !story.deleted;
          }),
        );
      });
  });
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
