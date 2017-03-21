import database from 'firebase/database';
import storage from 'firebase/storage';
import { getFrequency } from './frequencies';
import { createNotifications } from './notifications';
import { ACTIVITY_TYPES } from './types';
import { getUserInfo } from './users';
import { flattenArray, hashToArray } from '../helpers/utils';

export const getStory = storyId => {
  const db = database();

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
  const db = database();
  activeStory = storyId;

  return db.ref(`stories/${storyId}`).on('value', snapshot => {
    cb(snapshot.val());
  });
};

export const stopListening = listener => {
  const db = database();

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
  const db = database();

  const ref = db.ref().child('stories').push();

  return ref
    .set({
      id: ref.key,
      published: false,
      timestamp: database.ServerValue.TIMESTAMP,
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
  const db = database();

  // Fetch story data to merge it with the new data
  return db.ref(`stories/${key}`).once('value').then(draftSnapshot => {
    const draft = draftSnapshot.val();
    return db
      .ref()
      .update({
        [`stories/${key}`]: {
          ...draft,
          timestamp: database.ServerValue.TIMESTAMP,
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
    const db = database();

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
  return database().ref(`/stories/${id}`).update({
    locked,
  });
};

export const removeImage = ({ story, image }) => {
  const db = database();

  return db.ref(`stories/${story}/media/${image}`).remove();
};

export const getFileUrl = (file, story) => {
  if (!file) return;

  return storage().ref().child(`/stories/${story}/${file}`).getDownloadURL();
};

export const getStoryMedia = story => new Promise(resolve => {
  const db = database();

  db
    .ref(`stories/${story}/media`)
    .once('value', snapshot => resolve(snapshot.val()));
});

export const uploadMedia = (file, story, user) => {
  return new Promise((resolve, reject) => {
    // ensure we have the necessary bits to upload media
    if (!file || !story || !user) return;
    if (file.size > 3000000) {
      reject('Please upload files smaller than 3mb 😘');
    } // if the file is larger than 3mb

    let timestamp = Date.now();
    let storageRef = storage().ref();
    let fileName = `${file.name}.${timestamp}`;
    let fileRef = storageRef.child(`stories/${story}/${fileName}`);

    // we have to story an array of media urls so that we can fetch galleries from storage
    let storyRef = database().ref(`stories/${story}/media`).push();
    let mediaKey = storyRef.key;

    let updates = {};
    let mediaData = {
      fileName,
      type: file.type,
      key: mediaKey,
    };

    updates[`stories/${story}/media/${mediaKey}`] = mediaData;
    database().ref().update(updates);

    // cache the image for a year
    let metaData = {
      cacheControl: `public, max-age=${60 * 60 * 24 * 365}`,
      customMetadata: {
        creator: user.uid,
        name: file.name,
      },
    };

    fileRef.put(file, metaData).then(snapshot => {
      resolve({
        url: snapshot.downloadURL,
        meta: mediaData,
      });
    });
  });
};

export const uploadMultipleMedia = (files, story, user) => {
  let filesArr = hashToArray(files);
  return Promise.all(filesArr.map(file => uploadMedia(file, story, user)));
};
