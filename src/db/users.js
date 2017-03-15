import * as firebase from 'firebase';

/**
 * Create a new user
 *
 * Returns a Promise that resolves with the data
 */
export const createUser = user => {
  const db = firebase.database();
  const uid = user.uid;

  return db
    .ref()
    .update({
      [`users/${uid}/public/displayName`]: user.displayName,
      [`users/${uid}/public/uid`]: uid,
      [`users/${uid}/public/photoURL`]: user.photoURL,
      [`users/${uid}/public/frequencies/-Kenm0MXIRCq8GkwiJKb`]: {
        //=> add `hugs n bugs` to user's default frequencies
        id: '-Kenm0MXIRCq8GkwiJKb',
        permission: 'subscriber',
        joined: firebase.database.ServerValue.TIMESTAMP,
      },
      [`users/${uid}/public/frequencies/-KenmQHXnkUDN0S9UUsn`]: {
        //=> add `~Discover` to user's default frequencies
        id: '-KenmQHXnkUDN0S9UUsn',
        permission: 'subscriber',
        joined: firebase.database.ServerValue.TIMESTAMP,
      },
      [`users/${uid}/public/frequencies/-Kenmw8GUeJYnxXNc0WS`]: {
        //=> add `~Spectrum` to user's default frequencies
        id: '-Kenmw8GUeJYnxXNc0WS',
        permission: 'subscriber',
        joined: firebase.database.ServerValue.TIMESTAMP,
      },
      [`users/${uid}/private`]: {
        created: firebase.database.ServerValue.TIMESTAMP,
      },
    })
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
    .then(() => db.ref(`users/${uid}/public`).once('value'))
    .then(snapshot => snapshot.val());
};

/**
 * Get the public information of a user
 *
 * Returns a Promise that resolves with the data
 */
export const getPublicUserInfo = uid => {
  const db = firebase.database();

  return db.ref(`users/${uid}/public`).once('value').then(snapshot => {
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
