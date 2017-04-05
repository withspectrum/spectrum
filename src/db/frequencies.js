import database from 'firebase/database';

const getFrequencyById = id => {
  const db = database();

  return db
    .ref(`frequencies/${id}`)
    .once('value')
    .then(snapshot => snapshot.val());
};

const getFrequencyBySlug = slug => {
  const db = database();

  return db
    .ref(`frequencies`)
    .orderByChild('slug')
    .equalTo(slug)
    .once('value')
    .then(snapshot => {
      const frequencies = snapshot.val();
      // We assume there is only one frequency with a given slug
      return frequencies[Object.keys(frequencies)[0]];
    });
};

/**
 * Get a frequency from the database
 *
 * Returns a Promise which resolves with the data
 */
export const getFrequency = ({ id, slug }) => {
  if (id) return getFrequencyById(id);
  if (slug) return getFrequencyBySlug(slug);
  return Promise.resolve({});
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
  const db = database();
  const id = db.ref().child('frequencies').push().key;

  const frequency = {
    //=> used in the resolve below
    id,
    createdAt: database.ServerValue.TIMESTAMP,
    createdBy: uid,
    name: data.name,
    slug: data.slug,
    description: data.description,
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
        joined: database.ServerValue.TIMESTAMP,
      },
    },
  };

  // Save the new data to Firebase
  return db
    .ref()
    .update({
      [`users/${uid}/frequencies/${id}`]: {
        //=> add the frequency id to the user first
        id,
        permission: 'owner',
        joined: database.ServerValue.TIMESTAMP,
      },
    })
    .then(() => db.ref().update({
      //=> create the frequency and add the user
      [`frequencies/${id}/id`]: frequency.id,
      [`frequencies/${id}/users/${uid}/permission`]: 'owner',
      [`frequencies/${id}/users/${uid}/joined`]: database.ServerValue.TIMESTAMP,
    }))
    .then(() => db.ref().update({
      //=> then add the rest of the frequency data, since we'll validate against the user above
      [`frequencies/${id}/createdAt`]: frequency.createdAt,
      [`frequencies/${id}/createdBy`]: frequency.createdBy,
      [`frequencies/${id}/name`]: frequency.name,
      [`frequencies/${id}/slug`]: frequency.slug,
      [`frequencies/${id}/description`]: frequency.description,
      [`frequencies/${id}/settings`]: frequency.settings,
      [`frequencies/${id}/stories`]: frequency.stories,
    }))
    .then(() => {
      // Simulate the saved frequency for the client-side update
      resolve({ ...frequency, timestamp: Date.now() });
    });
});

/**
 * Remove a frequency from the db
 *
 * Returns a Promise that resolves with nothing or rejects with an error
 */
export const removeFrequency = id => new Promise((resolve, reject) => {
  const db = database();

  db
    .ref(`frequencies/${id}`)
    .child('users')
    .once('value')
    .then(snapshot => {
      const users = snapshot.val();
      Object.keys(users).forEach(userId => {
        //=> delete the frequency from every user who was a member
        db.ref(`/users/${userId}/frequencies/${id}`).remove();
      });
      // TODO: Delete all stories associated with a frequency?
    })
    .then(() => {
      db.ref().update({
        [`frequencies/${id}/slug`]: id, //=> reset the slug to be the id, so that future frequencies can use the slug
      });
    })
    .then(() => {
      resolve();
    });
});

/**
 * Update a frequency in the db
 */
export const updateFrequency = data => {
  const db = database();
  return db.ref().update({
    [`frequencies/${data.id}/name`]: data.name,
    [`frequencies/${data.id}/description`]: data.description,
    [`frequencies/${data.id}/settings`]: data.settings,
  });
};

/**
 * Add a user to a frequency
 *
 * Returns a promise that resolves either with the frequency data or rejects with an error
 */
export const addUserToFrequency = (userId, slug) => {
  const db = database();
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
        joined: database.ServerValue.TIMESTAMP,
      },
      [`users/${userId}/frequencies/${data.id}`]: {
        id: data.id,
        permission: 'subscriber',
        joined: database.ServerValue.TIMESTAMP,
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
  const db = database();

  // Remove a user from a frequency
  return db.ref().update({
    [`/frequencies/${freqId}/users/${userId}`]: null,
    [`/users/${userId}/frequencies/${freqId}`]: null,
  });
};

export const checkUniqueFrequencyName = name => {
  return new Promise((resolve, reject) => {
    database()
      .ref('frequencies')
      .orderByChild('slug')
      .equalTo(name)
      .once('value')
      .then(snapshot => {
        let val = snapshot.val();
        if (!val) return resolve(true); // if a frequency with this slug doesn't exist, it's okay to use the new name
        if (val.id === name) return resolve(true); // and if we're looking at the current frequency (i.e. changing the slug after creation), it's okay
        return resolve(false); // otherwise we can assume the slug is taken
      });
  });
};

let top = null;
export const getFeaturedFrequencies = () => {
  if (top) return Promise.resolve(top);
  return fetch(
    'https://us-central1-specfm-spectrum.cloudfunctions.net/topFreqs',
  )
    .then(response => response.json())
    .then(data => {
      // Cache top frequencies per session to avoid stressing the db
      top = data;
      return data;
    });
};
