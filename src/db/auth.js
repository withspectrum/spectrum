import auth from 'firebase/auth';

const signIn = provider => new Promise((resolve, reject) => {
  auth().signInWithRedirect(provider);

  auth().getRedirectResult().then(result => {
    return resolve(result.user);
  });
});

export const signOut = () => {
  return auth().signOut();
};

/**
 * Signs a user in with Twitter and returns the user
 */
export const signInWithTwitter = () => new Promise((resolve, reject) => {
  const twitter = new auth.TwitterAuthProvider();

  return signIn(twitter).then(user => {
    console.log('user');
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
