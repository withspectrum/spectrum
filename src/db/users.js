import * as firebase from 'firebase';

/**
 * Get the public information of a user
 *
 * Returns a Promise that resolves with the data
 */
export const getPublicUserInfo = uid => {
  const db = firebase.database();

  return db
    .ref(`users/${uid}/public`)
    .once('value')
    .then(snapshot => snapshot.val());
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
