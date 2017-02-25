import * as firebase from 'firebase';

/**
 * Create a draft story in the database
 *
 * Resolves the returned promise with the key of the created draft
 */
export const createDraft = (
  { user: { displayName, photoURL, uid }, frequencyId },
) => {
  const db = firebase.database();

  const ref = db.ref().child('stories').push();

  return ref
    .set({
      id: ref.key,
      published: false,
      timestamp: firebase.database.ServerValue.TIMESTAMP,
      frequencyId,
      creator: {
        displayName,
        photoURL,
        uid,
      },
      messages: {},
    })
    .then(() => ref.key);
};

/**
 * Create a story from a draft
 *
 * Resolves the returned promise with the stored story data from the db
 */
export const createStory = (
  { key, frequencyId, content: { media = '', title = '', description = '' } },
) => {
  const db = firebase.database();

  // Fetch story data to merge it with the new data
  return db.ref(`stories/${key}`).once('value').then(story => {
    return db
      .ref()
      .update({
        [`stories/${key}`]: {
          ...story.val(),
          timestamp: firebase.database.ServerValue.TIMESTAMP,
          published: true,
          frequencyId,
          content: {
            media,
            title,
            description,
          },
        },
        [`frequencies/${frequencyId}/stories/${key}`]: {
          id: key,
        },
      })
      .then(() => db.ref(`stories/${key}`).once('value'))
      .then(snapshot => snapshot.val());
  });
};

/**
 * Remove a story
 *
 * Returns a promise that's resolved with nothing if the story was deleted successfully
 */
export const removeStory = ({ storyId, frequencyId }) =>
  new Promise(resolve => {
    const db = firebase.database();

    console.log({ storyId, frequencyId });

    db.ref(`frequencies/${frequencyId}/stories/${storyId}`).remove();
    db.ref(`stories/${storyId}`).remove();

    resolve();
  });

/**
 * Set the locked status of a story
 *
 * Returns a promise that's resolved with nothing if it was set successfully
 */
export const setStoryLock = ({ id, locked }) => {
  return firebase.database().ref(`/stories/${id}`).update({
    locked,
  });
};
