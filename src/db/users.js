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
      [`users/${uid}/public/frequencies/-KcpUngtORLZzm56Biz4`]: {
        //=> add `hugs n bugs` to user's default frequencies
        id: '-KcpUngtORLZzm56Biz4',
        permission: 'subscriber',
        joined: firebase.database.ServerValue.TIMESTAMP,
      },
      [`users/${uid}/private`]: {
        created: firebase.database.ServerValue.TIMESTAMP,
      },
    })
    .then(() => db.ref().update({
      [`frequencies/-KcpUngtORLZzm56Biz4/users/${uid}`]: {
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
