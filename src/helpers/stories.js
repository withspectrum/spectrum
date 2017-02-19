import * as firebase from 'firebase';

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

export const fetchStoriesForFrequency = frequency => {
  return firebase
    .database()
    .ref('stories')
    .orderByChild('frequency')
    .equalTo(frequency)
    .once('value')
    .then(function(snapshot) {
      return snapshot.val();
    });
};

export const fetchStoriesForFrequencies = frequencies => {
  let keys = Object.keys(frequencies);
  return Promise.all(keys.map(fetchStoriesForFrequency));
};

export const getStoryPermission = (story, user, frequencies) => {
  if (!user.uid || !story) return

  let uid = user.uid;
  let storyFrequencyId = story.frequency; // get the frequency the story was posted in
  let frequencyMatch = frequencies.frequencies.filter(freq => {
    // and filter that against all the stories returned
    return freq.id === storyFrequencyId; // when we have a match, return the frequency object
  });

  if (frequencyMatch.length > 0) {
    let storyFrequency = frequencyMatch[0];

    let permission = frequencies.frequencies.length &&
      storyFrequency.users[uid]
      ? storyFrequency.users[uid].permission
      : 'subscriber';

    return permission;
  } else {
    return;
  }
};

export const uploadMedia = (file, story, user) => {
  return new Promise((resolve, reject) => {
    if (file && story) {
      let timestamp = Date.now()
      let storageRef = firebase.storage().ref();
      let fileRef = storageRef.child(`${story}/${timestamp}`)
      
      // cache the image for a year
      let metaData = {
        cacheControl: `public, max-age=${60 * 60 * 24 * 365}`,
        customMetadata: {
          creator: user.uid
        }
      }

      fileRef.put(file, metaData).then(snapshot => {
        console.log('image ' , snapshot)
        resolve(snapshot.downloadURL)
      });
    }
  })
}

export default {
  isStoryCreator,
  fetchStoriesForFrequency,
  fetchStoriesForFrequencies,
  getStoryPermission,
  uploadMedia
};
