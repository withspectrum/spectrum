import * as firebase from 'firebase';
import { set, track } from '../EventTracker';
import { createUser } from '../db/users';

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
    .signInWithRedirect(provider)
    .then(result => {
      let user = result.user;

      // set this uid in google analytics
      track('user', 'logged in', null);
      set(user.uid);

      dispatch({ type: 'STOP_LOADING' });

      // create the user in the db
      createUser(user);
    })
    .catch(err => {
      dispatch({ type: 'STOP_LOADING' });
      console.log('Error logging in: ', err);
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
  track('user', 'sign out', null);

  firebase.auth().signOut().then(() => {
    // once firebase verifies the logout is successful, clear localStorage
    localStorage.removeItem('state');

    // and then we refresh the page for good measure to make sure everything is cleared
    window.location.href = '/';
  }, err => {
    // if something funky goes wrong during signout, throw an error and clear localStorage for good measure
    localStorage.removeItem('state');
    console.log('Error signing out: ', err);
  });
};
