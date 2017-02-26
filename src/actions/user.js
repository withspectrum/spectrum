import * as firebase from 'firebase';
import { set, track } from '../EventTracker';

/*------------------------------------------------------------\*
*

LOGIN
We're using Twitter auth for login.
Firebase documentation: https://firebase.google.com/docs/auth/web/twitter-login

Firebase creates one "Authentication" record when a user signs up.
We have to manually create a "User" record in a separate "User" table
(Firebase doesn't use tables, but the concept stands).

*
\*------------------------------------------------------------*/
export const login = () => dispatch => {
  dispatch({ type: 'LOADING' });

  let provider = new firebase.auth.TwitterAuthProvider();
  firebase
    .auth()
    .signInWithPopup(provider)
    .then(result => {
      // the result contains the Authentication record created on Firebase
      let user = result.user;

      // We're going to use the uid to create a new record in the User table
      let uid = user.uid;

      // set this uid in google analytics
      set(uid);

      // Initiate a new child
      let newUserRef = firebase.database().ref().child(`users/${uid}`);

      // Make a one-time write
      newUserRef.once('value', snapshot => {
        // the callback function returns a snapshot of the new User record

        // if the record exists based on the uid, we'll end up skipping this step
        var exists = snapshot.val() !== null;

        // if the record doesn't exist, we'll create the new record
        if (!exists) {
          let userData = {
            uid: uid,
            created: firebase.database.ServerValue.TIMESTAMP,
            displayName: user.displayName, // returned from Twitter
            photoURL: user.photoURL, // returned from Twitter
            frequencies: {
              '-KcpUngtORLZzm56Biz4': { id: '-KcpUngtORLZzm56Biz4' },
            }, // auto subscribe the user to the Bugs n Hugs Frequency
          };

          // now we can set the user data
          newUserRef.set(userData, err => {
            // if something went wrong, we'll find out about it here
            if (err) {
              console.log('Error creating new user record: ', err);
            }
          });
        }
      });
    })
    .catch(err => {
      if (err) {
        console.log('Error logging in: ', err);
      }
    });
};

/*------------------------------------------------------------\*
*

signOut
Ensures we clear the browser's cookies, unauth on the backend, and reset our redux
store by triggering a refresh after clearing out localstorage

Note: localStorage is synced to redux, so it's important to clear it in this step
so a user doesn't see dead data in their browser.

*
\*------------------------------------------------------------*/
export const signOut = () => dispatch => {
  track('User', 'sign out');

  firebase.auth().signOut().then(() => {
    // once firebase verifies the logout is successful, clear localStorage
    localStorage.removeItem('state');

    // and then we refresh the page for good measure to make sure everything is cleared
    window.location.href = '/';
  }, err => {
    // if something funky goes wrong during signout, throw an error and clear localStorage for good measure
    if (err) {
      localStorage.removeItem('state');
      console.log('Error signing out: ', err);
    }
  });
};
