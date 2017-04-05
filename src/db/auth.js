import auth from 'firebase/auth';
import Raven from 'raven-js';

const signIn = provider => new Promise((resolve, reject) => {
  auth().signInWithRedirect(provider);

  auth().getRedirectResult().then(result => {
    return resolve(result.user);
  });
});

export const signOut = () => {
  Raven.setUserContext(); // stop tracking uid in sentry
  return auth().signOut();
};

/**
 * Signs a user in with Twitter and returns the user
 */
export const signInWithTwitter = () => new Promise((resolve, reject) => {
  const twitter = new auth.TwitterAuthProvider();

  return signIn(twitter).then(user => {
    resolve(user);
  });
});

/**
 * Listen to authentication changes
 *
 * Calls the passed callback with null if no authentication is there,
 * otherwise passes the user object
 */
export const listenToAuth = cb => {
  return auth().onAuthStateChanged(cb);
};
