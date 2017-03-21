import auth from 'firebase/auth';

const signIn = provider => {
  return auth().signInWithPopup(provider);
};

export const signOut = () => {
  return auth().signOut();
};

/**
 * Signs a user in with Twitter and returns the user
 */
export const signInWithTwitter = () => {
  const twitter = new auth.TwitterAuthProvider();
  return signIn(twitter).then(result => result.user);
};
