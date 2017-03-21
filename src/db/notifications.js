import * as firebase from 'firebase';

/**
 * Create notifications for a bunch of users
 */
export const createNotifications = (
  { users, activityType, sender, content, ids = {} },
) => {
  const db = firebase.database();
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
        timestamp: firebase.database.ServerValue.TIMESTAMP,
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

/**
 * Listen to notifications
 */
export const listenToNotifications = (userId, cb) => {
  const db = firebase.database();

  return db.ref(`notifications/${userId}`).on('value', snapshot => {
    const notifications = snapshot.val();
    if (!notifications) return cb([]);
    const array = Object.keys(notifications).map(id => notifications[id]);
    cb(array);
  });
};

/**
 * Mark messages of a story read
 */
export const markStoryRead = (storyId, userId) => new Promise(resolve => {
  const db = firebase.database();

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
