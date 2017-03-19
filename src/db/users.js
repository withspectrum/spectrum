import * as firebase from 'firebase';
import { filter as fuzzysearch } from 'fuzzy';
import { hashToArray } from '../helpers/utils';

/**
 * Create a new user
 *
 * Returns a Promise that resolves with the data
 */
export const createUser = user => {
  const db = firebase.database();
  const uid = user.uid;

  const updates = {
    [`users/${uid}/displayName`]: user.displayName,
    [`users/${uid}/uid`]: uid,
    [`users/${uid}/photoURL`]: user.photoURL,
    [`users/${uid}/created`]: firebase.database.ServerValue.TIMESTAMP,
    [`users/${uid}/frequencies/-Kenm0MXIRCq8GkwiJKb`]: {
      //=> add `hugs n bugs` to user's default frequencies
      id: '-Kenm0MXIRCq8GkwiJKb',
      permission: 'subscriber',
      joined: firebase.database.ServerValue.TIMESTAMP,
    },
    [`users/${uid}/frequencies/-KenmQHXnkUDN0S9UUsn`]: {
      //=> add `~Discover` to user's default frequencies
      id: '-KenmQHXnkUDN0S9UUsn',
      permission: 'subscriber',
      joined: firebase.database.ServerValue.TIMESTAMP,
    },
    [`users/${uid}/frequencies/-Kenmw8GUeJYnxXNc0WS`]: {
      //=> add `~Spectrum` to user's default frequencies
      id: '-Kenmw8GUeJYnxXNc0WS',
      permission: 'subscriber',
      joined: firebase.database.ServerValue.TIMESTAMP,
    },
  };

  if (user.email) {
    updates[`users/${uid}/email`] = true;
    updates[`users_private/${uid}/email`] = user.email;
  }

  return db
    .ref()
    .update(updates)
    .then(() => db.ref().update({
      [`frequencies/-Kenm0MXIRCq8GkwiJKb/users/${uid}`]: {
        permission: 'subscriber',
        joined: firebase.database.ServerValue.TIMESTAMP,
      },
      [`frequencies/-KenmQHXnkUDN0S9UUsn/users/${uid}`]: {
        permission: 'subscriber',
        joined: firebase.database.ServerValue.TIMESTAMP,
      },
      [`frequencies/-Kenmw8GUeJYnxXNc0WS/users/${uid}`]: {
        permission: 'subscriber',
        joined: firebase.database.ServerValue.TIMESTAMP,
      },
    }))
    .then(() => db.ref(`users/${uid}`).once('value'))
    .then(snapshot => snapshot.val());
};

/**
 * Get the public information of a user
 *
 * Returns a Promise that resolves with the data
 */
export const getUserInfo = uid => {
  const db = firebase.database();

  return db.ref(`users/${uid}`).once('value').then(snapshot => {
    if (!snapshot.val()) {
      /* temporary hack to force a localstorage clear
      * this happened as a result of a bug introduced on March 14th
      * where a user could authenticate but a record would not be created in the users db
      * as a result they would be stuck in infinite loading
      * this snippet will force a localStorage clear when the user refreshes the page so that
      * they will at least be able to log in again with the new and proper auth method
      */
      localStorage.clear();
    }

    return snapshot.val();
  });
};

/**
 * Listen to authentication changes
 *
 * Calls the passed callback with null if no authentication is there,
 * otherwise passes the user object
 */
export const listenToAuth = cb => {
  return firebase.auth().onAuthStateChanged(cb);
};

export const checkUniqueUsername = (name, uid) => {
  return new Promise((resolve, reject) => {
    firebase
      .database()
      .ref('users')
      .orderByChild('username')
      .equalTo(name)
      .once('value')
      .then(snapshot => {
        let val = snapshot.val();
        if (!val) return resolve(true); // if a user with this username doesn't exist, it's okay to use the new name
        if (val[uid]) return resolve(true); // and if we're looking at the current user (i.e. changing the username after creation), it's okay
        return resolve(false); // otherwise we can assume the username is taken
      });
  });
};

export const setUsernameAndEmail = ({ uid, username, email }) => {
  const db = firebase.database();

  const updates = {
    [`users/${uid}/username`]: username,
  };

  if (email) {
    updates[`users_private/${uid}/email`] = email;
    updates[`users/${uid}/email`] = true;
  }

  return db
    .ref()
    .update(updates)
    .then(() => db.ref(`users/${uid}`).once('value'))
    .then(snapshot => snapshot.val());
};

const cache = {};
export const findUsersByUsername = username => {
  if (!username) return Promise.resolve([]);
  // Cache results so we don't stress the db unnecessarily
  if (cache[username]) return Promise.resolve(cache[username]);
  const db = firebase.database();

  return db
    .ref('users')
    .orderByChild('username')
    .once('value')
    .then(snapshot => snapshot.val())
    .then(users => {
      const filtered = fuzzysearch(username, hashToArray(users), {
        extract: user => user.username || '',
      });
      const formatted = filtered
        // Sort results by descending score (maybe the lib already does this?)
        .sort((a, b) => b.score - a.score)
        // Return the original data, rather than fuzzy's wrapping
        .map(user => user.original);
      cache[username] = formatted;
      return formatted;
    });
};
