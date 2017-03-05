import * as firebase from 'firebase';
import uniq from 'lodash.uniq';
import { hashToArray } from './utils';
import { track } from '../EventTracker';

export const isStoryCreator = (story, user) => {
  if (!user) {
    return;
  }

  let uid = user.uid;
  let creator = story.creator.uid;

  if (uid === creator) {
    return true;
  } else {
    return false;
  }
};

export const getUserFromId = uid => {
  return firebase
    .database()
    .ref(`users/${uid}/public`)
    .once('value')
    .then(snapshot => {
      let val = snapshot.val();
      let obj = {};
      obj['uid'] = uid;
      obj['name'] = val.displayName;
      obj['photoURL'] = val.photoURL;
      return obj;
    });
};

export const getUsersFromMessageGroups = groups => {
  let users = groups.map(group => {
    return group[0].userId;
  });
  users = uniq(users);
  return Promise.all(users.map(getUserFromId));
};

export const fetchStoriesForFrequency = frequency => {
  return firebase
    .database()
    .ref('stories')
    .orderByChild('frequency')
    .equalTo(frequency)
    .once('value')
    .then(snapshot => {
      return snapshot.val();
    });
};

export const fetchStoriesForFrequencies = frequencies => {
  let keys = Object.keys(frequencies);
  return Promise.all(keys.map(fetchStoriesForFrequency));
};

export const getStoryPermission = (story, user, frequencies) => {
  if (!user.uid || !story) return;

  let uid = user.uid;
  let storyFrequencyId = story.frequencyId; // get the frequency the story was posted in
  let frequencyMatch = frequencies.frequencies.filter(freq => {
    // and filter that against all the stories returned
    return freq.id === storyFrequencyId; // when we have a match, return the frequency object
  });

  if (frequencyMatch.length > 0) {
    let storyFrequency = frequencyMatch[0];

    let permission = frequencies.frequencies.length && storyFrequency.users[uid]
      ? storyFrequency.users[uid].permission
      : 'subscriber';

    return permission;
  } else {
    return;
  }
};

export const uploadMedia = (file, story, user) => {
  return new Promise((resolve, reject) => {
    // ensure we have the necessary bits to upload media
    if (!file || !story || !user) return;
    if (file.size > 3000000) {
      reject('Please upload files smaller than 3mb 😘');
    } // if the file is larger than 3mb

    let timestamp = Date.now();
    let storageRef = firebase.storage().ref();
    let fileName = `${file.name}.${timestamp}`;
    let fileRef = storageRef.child(`stories/${story}/${fileName}`);

    // we have to story an array of media urls so that we can fetch galleries from storage
    let storyRef = firebase.database().ref(`stories/${story}/media`).push();
    let mediaKey = storyRef.key;

    let updates = {};
    let mediaData = {
      fileName,
      type: file.type,
    };

    updates[`stories/${story}/media/${mediaKey}`] = mediaData;
    firebase.database().ref().update(updates);

    // cache the image for a year
    let metaData = {
      cacheControl: `public, max-age=${60 * 60 * 24 * 365}`,
      customMetadata: {
        creator: user.uid,
        name: file.name,
      },
    };

    fileRef.put(file, metaData).then(snapshot => {
      track('media', 'uploaded', null);

      resolve(snapshot.downloadURL);
    });
  });
};

export const uploadMultipleMedia = (files, story, user) => {
  let filesArr = hashToArray(files);
  return Promise.all(filesArr.map(file => uploadMedia(file, story, user)));
};
