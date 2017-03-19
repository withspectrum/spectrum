import * as firebase from 'firebase';
import { getFrequency } from './frequencies';
import { createNotifications } from './notifications';
import { ACTIVITY_TYPES } from './types';
import { getUserInfo } from './users';
import { flattenArray } from '../helpers/utils';

export const getStory = storyId => {
  const db = firebase.database();

  return db
    .ref(`stories/${storyId}`)
    .once('value')
    .then(snapshot => snapshot.val());
};

export const getStories = ({ frequencyId, frequencySlug }) => {
  return getFrequency({ id: frequencyId, slug: frequencySlug }).then(freq => {
    if (!freq.stories) return Promise.resolve([]);
    const stories = Object.keys(freq.stories);
    return Promise.all(stories.map(story => getStory(story)));
  });
};

export const getAllStories = userId => {
  return getUserInfo(userId)
    .then(user => {
      if (!user.frequencies) return [];
      const freqs = Object.keys(user.frequencies);
      return Promise.all(freqs.map(freq => getStories({ frequencyId: freq })));
    })
    .then(nested => flattenArray(nested));
};

let activeStory;
export const listenToStory = (storyId, cb) => {
  const db = firebase.database();
  activeStory = storyId;

  return db.ref(`stories/${storyId}`).on('value', snapshot => {
    cb(snapshot.val());
  });
};

export const stopListening = listener => {
  const db = firebase.database();

  return db.ref(`stories/${activeStory}`).off('value', listener);
};

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
  { key, frequency, content: { media = '', title = '', description = '' } },
) => {
  const db = firebase.database();

  // Fetch story data to merge it with the new data
  return db.ref(`stories/${key}`).once('value').then(draftSnapshot => {
    const draft = draftSnapshot.val();
    return db
      .ref()
      .update({
        [`stories/${key}`]: {
          ...draft,
          timestamp: firebase.database.ServerValue.TIMESTAMP,
          published: true,
          frequencyId: frequency.id,
          content: {
            media,
            title,
            description,
          },
        },
        [`frequencies/${frequency.id}/stories/${key}`]: {
          id: key,
        },
      })
      .then(() => db.ref(`stories/${key}`).once('value'))
      .then(storySnapshot => {
        const story = storySnapshot.val();
        createNotifications({
          // Only create notifications for other users
          users: Object.keys(frequency.users)
            .filter(user => user !== draft.creator.uid),
          activityType: ACTIVITY_TYPES.NEW_STORY,
          ids: {
            frequency: frequency.id,
            story: key,
          },
          sender: {
            uid: draft.creator.uid,
            displayName: draft.creator.displayName,
            photoURL: draft.creator.photoURL,
          },
          content: story.content.title.substr(0, 140),
        });
        return story;
      });
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

    db.ref().update({
      [`/stories/${storyId}/deleted`]: true,
      [`/frequencies/${frequencyId}/stories/${storyId}/deleted`]: true,
    });

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
