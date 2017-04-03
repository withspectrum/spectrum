import { set, track } from '../EventTracker';
import {
  createUser,
  createSubscription,
  deleteSubscription,
} from '../db/users';
import { signInWithTwitter, signOut as logOut } from '../db/auth';
import { monitorUser, stopUserMonitor } from '../helpers/users';
import { logException } from '../helpers/utils';
import { apiURL } from '../config/api';

/**
 * Firebase creates one "Authentication" record when a user signs up.
 * We have to manually create a "User" record in a separate "User" table
 */
export const login = () => dispatch => {
  dispatch({ type: 'LOADING' });

  signInWithTwitter()
    .then(user => {
      // set this uid in google analytics
      track('user', 'logged in', null);
      set(user.uid);
      monitorUser(user.uid);

      dispatch({ type: 'STOP_LOADING' });

      // create the user in the db
      createUser(user);
    })
    .catch(err => {
      dispatch({ type: 'STOP_LOADING' });
      logException(err);
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

  logOut().then(
    () => {
      stopUserMonitor();
      // once firebase verifies the logout is successful, clear localStorage
      localStorage.removeItem('state');

      // and then we refresh the page for good measure to make sure everything is cleared
      window.location.href = '/';
    },
    err => {
      // if something funky goes wrong during signout, throw an error and clear localStorage for good measure
      localStorage.removeItem('state');
      logException(err);
    },
  );
};

/**
 * checkStatus and parseJSON are used when upgrading and downgrading users to parse
 * responses from the firebase cloud function
 */
function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    var error = new Error(response.statusText);
    error.response = response;
    throw error;
  }
}

function parseJSON(response) {
  return response.json();
}

/**
 * Upgrade user takes a token and writes it to the users_private object in firebase. This write
 * triggers a cloud function which will parse the token to create a customer in Stripe,
 * and then immediately create a new subscription for that customer
 */
export const upgradeUser = (token, plan) => (dispatch, getState) => {
  const uid = getState().user.uid;

  track('upgrade', 'payment inited', null);

  dispatch({
    type: 'LOADING',
  });

  fetch(`${apiURL}/payments-createSubscription`, {
    method: 'POST',
    headers: {
      Accept: 'application/x-www-form-urlencoded',
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: `token=${JSON.stringify(token)}&plan=${plan}`,
  })
    .then(checkStatus)
    .then(parseJSON)
    .then(data => {
      createSubscription(data, uid, plan).then(user => {
        track('upgrade', 'payment completed', null);

        dispatch({
          type: 'UPGRADE_USER',
          user,
        });

        dispatch({
          type: 'STOP_LOADING',
        });
      });
    })
    .catch(err => {
      if (err) {
        dispatch({
          type: 'SET_UPGRADE_ERROR',
          error: err,
        });

        dispatch({
          type: 'STOP_LOADING',
        });
      }

      logException(err);
    });
};

/**
 * Because a user may have multiple subscriptions, we need to know which one to delete
 * in the database. We pass a subscription ID to a cloud function endpoint, delete the
 * subscription in stripe, then when successful, we delete the subscription data from the
 * user and user_private objects.
 */
export const downgradeUser = subscriptionId => (dispatch, getState) => {
  const user = getState().user;

  track('downgrade', 'inited', null);

  dispatch({
    type: 'LOADING',
  });

  // if somehow a user triggers this without being on a paid plan, return
  if (!user.subscriptions) return;

  fetch(`${apiURL}/payments-deleteSubscription`, {
    method: 'POST',
    headers: {
      Accept: 'application/x-www-form-urlencoded',
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: `subscriptionId=${subscriptionId}`,
  })
    .then(checkStatus)
    .then(parseJSON)
    .then(data => {
      deleteSubscription(user.uid, subscriptionId).then(user => {
        track('downgrade', 'complete', null);

        dispatch({
          type: 'DOWNGRADE_USER',
          user,
        });

        dispatch({
          type: 'STOP_LOADING',
        });
      });
    })
    .catch(err => {
      if (err) {
        console.log('error downgrading: ', err);

        dispatch({
          type: 'STOP_LOADING',
        });
      }

      logException(err);
    });
};
