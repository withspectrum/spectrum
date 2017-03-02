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
      [`users/${uid}/public`]: {
        uid: uid,
        displayName: user.displayName, // returned from Twitter
        photoURL: user.photoURL, // returned from Twitter
        frequencies: {
          '-KcpUngtORLZzm56Biz4': { id: '-KcpUngtORLZzm56Biz4' },
        }, // auto subscribe the user to the Bugs n Hugs Frequency
      },
      [`users/${uid}/private`]: {
        created: firebase.database.ServerValue.TIMESTAMP,
      },
    })
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
