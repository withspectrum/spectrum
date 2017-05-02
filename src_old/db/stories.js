// @flow
//$FlowFixMe
import database from 'firebase/database';
//$FlowFixMe
import storage from 'firebase/storage';

import { getFrequency } from './frequencies';
import { createNotifications } from './notifications';
import { ACTIVITY_TYPES } from './types';
import { getUserInfo } from './users';
import { flattenArray, hashToArray } from '../helpers/utils';

export const getStory = (storyId: string) => {
  const db = database();

  return db
    .ref(`stories/${storyId}`)
    .once('value')
    .then(snapshot => snapshot.val());
};

type getStoriesProps = { frequencyId?: string, frequencySlug?: string };
export const getStories = ({ frequencyId, frequencySlug }: getStoriesProps) => {
  return getFrequency({ id: frequencyId, slug: frequencySlug }).then(freq => {
    if (!freq.stories) return Promise.resolve([]);
    const stories = Object.keys(freq.stories);
    return Promise.all(stories.map(story => getStory(story)));
  });
};

export const getAllStories = (userId: string) => {
  return getUserInfo(userId)
    .then(user => {
      if (!user.frequencies) return [];
      const freqs = Object.keys(user.frequencies);
      return Promise.all(freqs.map(freq => getStories({ frequencyId: freq })));
    })
    .then(nested => flattenArray(nested));
};

let activeStory;
export const listenToStory = (storyId: string, cb: Function) => {
  const db = database();
  activeStory = storyId;

  return db.ref(`stories/${storyId}`).on('value', snapshot => {
    cb(snapshot.val());
  });
};

export const stopListening = (listener: Function) => {
  const db = database();

  return db.ref(`stories/${activeStory}`).off('value', listener);
};

type createDraftProps = {
  user: {
    displayName: string,
    photoURL: string,
    uid: string,
  },
  frequencyId: string,
};
export const createDraft = ({
  user: { displayName, photoURL, uid },
  frequencyId,
}: createDraftProps) => {
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

type createStoryProps = {
  key: string,
  frequency: Object,
  content: {
    media: string,
    title: string,
    description: string,
  },
  metadata: Object,
};
export const createStory = ({
  key,
  frequency,
  content: { media = '', title = '', description = '' },
  metadata,
}: createStoryProps) => {
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
          metadata,
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
          users: Object.keys(frequency.users).filter(
            user => user !== draft.creator.uid
          ),
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

export const editStory = ({
  key,
  content: { media = '', title = '', description = '' },
  metadata,
}) => {
  const db = database();

  // Fetch story data to merge it with the new data
  return db.ref(`stories/${key}`).once('value').then(snapshot => {
    const story = snapshot.val();
    const editDate = new Date().getTime();
    return db
      .ref()
      .update({
        [`stories/${key}/edits/${editDate}`]: {
          content: {
            title: story.content.title,
            description: story.content.description,
          },
          metadata: story.metadata ? story.metadata : '',
        },
      })
      .then(() => db.ref(`stories/${key}`).once('value'))
      .then(story => {
        db.ref().update({
          [`stories/${key}`]: {
            ...story.val(),
            published: true,
            edited: editDate,
            content: {
              title,
              description,
            },
            metadata: metadata ? metadata : null,
          },
        });
      })
      .then(() => db.ref(`stories/${key}`).once('value'))
      .then(story => {
        return story.val();
      });
  });
};

/**
 * Remove a story
 *
 * Returns a promise that's resolved with nothing if the story was deleted successfully
 */
type removeStoryProps = { storyId: string, frequencyId: string };
export const removeStory = ({ storyId, frequencyId }: removeStoryProps) =>
  new Promise(resolve => {
    const db = database();

    db.ref().update({
      [`/stories/${storyId}/deleted`]: true,
      [`/frequencies/${frequencyId}/stories/${storyId}/deleted`]: true,
    });

    resolve();
  });

type setStoryLockProps = { id: string, locked: boolean };
export const setStoryLock = ({ id, locked }: setStoryLockProps) => {
  return database().ref(`/stories/${id}`).update({
    locked,
  });
};

type removeImageProps = { storyId: string, image: string };
export const removeImageFromStory = ({ image, storyId }: removeImageProps) => {
  const db = database();

  return db.ref(`stories/${storyId}/media/${image}`).remove();
};
