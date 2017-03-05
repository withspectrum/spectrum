import * as firebase from 'firebase';

/**
 * Get a frequency from the database
 *
 * Returns a Promise which resolves with the data
 */
export const getFrequency = id => {
  const db = firebase.database();

  return db
    .ref(`frequencies/${id}`)
    .once('value')
    .then(snapshot => snapshot.val());
};

/**
 * Save a new frequency in the db
 *
 * Returns a Promise that either resolves with the created frequency or rejects with an error
 */
export const saveNewFrequency = ({ uid, data }) => new Promise((
  resolve,
  reject,
) => {
  const db = firebase.database();
  const id = db.ref().child('frequencies').push().key;

  const frequency = {
    //=> used in the resolve below
    id,
    createdAt: firebase.database.ServerValue.TIMESTAMP,
    createdBy: uid,
    name: data.name,
    slug: data.slug,
    settings: {
      private: data.private,
      icon: null,
      tint: '#3818E5',
    },
    stories: {},
    users: {
      // Creator gets full admin rights
      [uid]: {
        permission: 'owner',
        joined: firebase.database.ServerValue.TIMESTAMP,
      },
    },
  };

  // Save the new data to Firebase
  return db
    .ref()
    .update({
      [`users/${uid}/public/frequencies/${id}`]: {
        //=> add the frequency id to the user first
        id,
        permission: 'owner',
        joined: firebase.database.ServerValue.TIMESTAMP,
      },
    })
    .then(() => db.ref().update({
      //=> create the frequency and add the user
      [`frequencies/${id}/id`]: frequency.id,
      [`frequencies/${id}/users/${uid}/permission`]: 'owner',
      [`frequencies/${id}/users/${uid}/joined`]: firebase.database.ServerValue.TIMESTAMP,
    }))
    .then(() => db.ref().update({
      //=> then add the rest of the frequency data, since we'll validate against the user above
      [`frequencies/${id}/createdAt`]: frequency.createdAt,
      [`frequencies/${id}/createdBy`]: frequency.createdBy,
      [`frequencies/${id}/name`]: frequency.name,
      [`frequencies/${id}/slug`]: frequency.slug,
      [`frequencies/${id}/settings`]: frequency.settings,
      [`frequencies/${id}/stories`]: frequency.stories,
    }))
    .then(() => {
      // Simulate the saved frequency for the client-side update
      resolve({ ...frequency, timestamp: Date.now() });
    })
    .catch(reject);
});

/**
 * Remove a frequency from the db
 *
 * Returns a Promise that resolves with nothing or rejects with an error
 */
export const removeFrequency = id => new Promise((resolve, reject) => {
  const db = firebase.database();

  db
    .ref(`frequencies/${id}`)
    .child('users')
    .once('value')
    .then(snapshot => {
      const users = snapshot.val();
      Object.keys(users).forEach(userId => {
        db.ref(`/users/${userId}/public/frequencies/${id}`).remove();
      });
      db.ref(`/frequencies/${id}`).remove();
      // TODO: Delete all stories associated with a frequency?
      resolve();
    })
    .catch(reject);
});

/**
 * Update a frequency in the db
 */
export const updateFrequency = data => {
  const db = firebase.database();

  return db.ref().update({
    [`frequencies/${data.id}/name`]: data.name,
    [`frequencies/${data.id}/settings`]: data.settings,
  });
};

/**
 * Add a user to a frequency
 *
 * Returns a promise that resolves either with the frequency data or rejects with an error
 */
export const addUserToFrequency = (userId, slug) => {
  const db = firebase.database();
  return db
    .ref(`/frequencies`)
    .orderByChild('slug')
    .equalTo(slug)
    .once('value')
    .then(snapshot => {
      const data = snapshot.val();
      // { '-Kyasfde123': { ...frequencyData } } -> { ...frequencyData }
      return data[Object.keys(data)[0]];
    })
    .then(data => db.ref().update({
      [`frequencies/${data.id}/users/${userId}`]: {
        permission: 'subscriber',
        joined: firebase.database.ServerValue.TIMESTAMP,
      },
      [`users/${userId}/public/frequencies/${data.id}`]: {
        id: data.id,
        permission: 'subscriber',
        joined: firebase.database.ServerValue.TIMESTAMP,
      },
    }))
    .then(() =>
      db.ref(`/frequencies`).orderByChild('slug').equalTo(slug).once('value'))
    .then(snapshot => {
      const data = snapshot.val();
      // { '-Kyasfde123': { ...frequencyData } } -> { ...frequencyData }
      return data[Object.keys(data)[0]];
    });
};

/**
 * Remove a user from a frequency
 */
export const removeUserFromFrequency = (userId, freqId) => {
  const db = firebase.database();

  // Remove a user from a frequency
  return db.ref().update({
    [`/frequencies/${freqId}/users/${userId}`]: null,
    [`/users/${userId}/public/frequencies/${freqId}`]: null,
  });
};
