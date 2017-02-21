import * as firebase from 'firebase';
import { getCurrentFrequency } from '../helpers/frequencies';
import { fetchFrequenciesForUser, deleteFrequencyFromAllUsers } from '../helpers/utils';

/*------------------------------------------------------------\*
*

setup
Takes getState() as an only argument. The reason we do this is so that in any future
actions or functions, we can easily destructure the returned object of setup() to get
any necessary bits of data about the current state of the app

*
\*------------------------------------------------------------*/
export const setup = stateFetch => {
  let state = stateFetch;
  let frequencies = state.frequencies;
  let stories = state.stories;
  let user = state.user;
  let uid = user.uid;

  // return an object that we can destructure in future functions
  return {
    database: firebase.database(), // we're also including the database so we don't have to keep defining it elsewhere
    state,
    frequencies,
    stories,
    user,
    uid,
  };
};

/*------------------------------------------------------------\*
*

setActiveFrequency
Always takes an ID of a frequency.

Note:
A frequency can be public, private, or 1:1. Therefore, we will need to
run checks in our other components and actions to make sure the user
always has permissions to see/interact with frequencies safely.

*
\*------------------------------------------------------------*/
export const setActiveFrequency = frequency => ({
  type: 'SET_ACTIVE_FREQUENCY',
  frequency,
});

/*------------------------------------------------------------\*
*

loadFrequencies
This creates an active listener to the frequencies that are saved in the database.

NOTE: Right now we are returning ALL frequencies. This will need to change
very soon as we want to respect private frequencies and avoid a noisy new user experience.

*
\*------------------------------------------------------------*/
export const loadFrequencies = () => (dispatch, getState) => {
  let { user } = getState();
  let userFrequencies = user.frequencies;
  if (!user.uid) return;
  dispatch({ type: 'LOADING' });

  fetchFrequenciesForUser(userFrequencies).then(frequencies => {
    let obj = frequencies.slice().filter(frequency => frequency !== null);

    dispatch({
      type: 'SET_FREQUENCIES',
      frequencies: obj,
    });
  });
};

/*------------------------------------------------------------\*
*

addFrequency
Creating a new frequency requires a few operations:

1. Create the record on Firebase
2. Set initial data for that new record, including information about the user who is doing the creation
3. Add the newly created Frequency id to the user's record in Firebase

We have a two-way relationship between a user and frequencies:
1. A user is subscribed to many frequencies
2. A frequency has many users

This means that a change in one of these fields requires a change in the other

NOTE: We do not dispatch anything in this action because we have an open listener to any changes in the frequencies that was set in loadFrequencies()

*
\*------------------------------------------------------------*/
export const addFrequency = (obj) => (dispatch, getState) => {
  return new Promise((resolve, reject) => {
    dispatch({ type: 'LOADING' });

    let { database, uid } = setup(getState());

    // .push() creates a new key in the database
    let newFrequencyRef = database.ref().child('frequencies').push();

    // this key can now be used to update the user and set metadata about the frequency
    let newFrequencyKey = newFrequencyRef.key;

    // we're going to populate the first user in the frequency object
    let user = {
      permission: 'owner', // with the 'owner' permission so that the current user will have full admin rights
    };

    // since we want to simultaneously update the frequencies table and the users table, we're going to construct a data fan-out
    // documentation: https://firebase.google.com/docs/database/web/read-and-write
    let updates = {};

    // here we're creating the new frequency
    let newFrequencyData = {
      // with our first user set as a key, with a value of the permission
      users: {
        [uid]: user,
      },
      id: newFrequencyKey,
      createdAt: firebase.database.ServerValue.TIMESTAMP,
      createdBy: uid,
      name: obj.name,
      slug: obj.slug,
      settings: {
        private: obj.private,
        icon: null,
        tint: '#3818E5',
      },
    };

    // create the object we want saved in the user model
    let userFrequencyData = {
      id: newFrequencyKey,
      permission: 'owner',
    };

    // prep our simultaneous saves in Firebase
    updates[`frequencies/${newFrequencyKey}`] = newFrequencyData;
    updates[`users/${uid}/frequencies/${newFrequencyKey}`] = userFrequencyData;

    // set the active frequency in redux as the newly created frequency
    dispatch({
      type: 'ADD_FREQUENCY',
      frequency: newFrequencyData,
    });

    // save the new data to Firebase
    return database.ref().update(updates, err => {
      if (err) console.log('Error creating a frequency: ', err)
      resolve()
    });
  })
};

/*------------------------------------------------------------\*
*

editFrequency


*
\*------------------------------------------------------------*/
export const editFrequency = (obj) => (dispatch, getState) => {
  return new Promise((resolve, reject) => {
    dispatch({ type: 'LOADING' });

    let { database, uid } = setup(getState());

    // save the new data to Firebase
    return database.ref(`frequencies/${obj.id}`).update(obj, err => {
      if (err) console.log('Error editing a frequency: ', err)
      
      // set the active frequency in redux as the newly created frequency
      dispatch({
        type: 'SET_ACTIVE_FREQUENCY',
        frequency: obj.slug,
      });

      dispatch({
        type: 'EDIT_FREQUENCY',
        frequency: obj
      });

      resolve()
    });
  })
};

/*------------------------------------------------------------\*
*

deleteFrequency


*
\*------------------------------------------------------------*/
export const deleteFrequency = (id) => (dispatch, getState) => {
  return new Promise((resolve, reject) => {
    dispatch({ type: 'LOADING' });
    let { database, uid } = setup(getState());

    let frequencyRef = database.ref(`frequencies/${id}`)
    let getFrequencyUsers = frequencyRef.child('users').once('value').then(snapshot => {
      return snapshot.val()
    })

    getFrequencyUsers.then(users => {
      let keys = Object.keys(users)
      return deleteFrequencyFromAllUsers(keys, id)      
    })
    .then(() => {
      firebase.database().ref(`/frequencies/${id}`).remove(); // delete the frequency

      dispatch({
        type: 'DELETE_FREQUENCY',
        id,
      });

      // redirect the user so that they don't end up on a broken url
      window.location.href = '/';
    }).catch(err => {
      if (err) {
        console.log("Unable to delete frequency ", err)
      }
    })
  })
};

/*------------------------------------------------------------\*
*

subscribeFrequency
When subscribing a user to a frequency, we need to perform two simultaneous actions:

1. Update the frequency record to reflect the new user
2. Update the user's record to reflect the new frequency

We will always set role as "subscriber" in this function and let moderation roles be set elsewhere (usually by frequency owners)

*
\*------------------------------------------------------------*/
export const subscribeFrequency = () => (dispatch, getState) => {
  let { database, frequencies, uid } = setup(getState());

  // we'll use this key to update the user record and to find the correct frequency record to update
  let frequencyKey = frequencies.active;

  // data to be stored on the user record
  let userFrequencyData = {
    id: frequencyKey,
    permission: 'subscriber',
  };

  // data to be inserted into the frequency record for 'users'
  let user = {
    permission: 'subscriber',
  };

  // set up a new simultaneous update
  let updates = {};

  // prep our simultaneous saves in Firebase
  updates[`users/${uid}/frequencies/${frequencyKey}`] = userFrequencyData;
  updates[`frequencies/${frequencyKey}/users/${uid}`] = user;

  // save the new data to Firebase
  return database.ref().update(updates);
};

/*------------------------------------------------------------\*
*

unsubscribeFrequency
When unsubscribing a user from a frequency, we need to perform two simultaneous actions:

1. Update the frequency record to remove the user
2. Update the user's record to reflect the removed frequency

We do not allower the user of the frequency to leave via an unsubscribe button. While we check for this in the component and hide the 'leave' button, we'll double check here when the action is being performed

*
\*------------------------------------------------------------*/
export const unsubscribeFrequency = () => (dispatch, getState) => {
  let { database, frequencies, uid } = setup(getState());

  // we'll use this key to update the user record and to find the correct frequency record to update
  let frequencyKey = frequencies.active;

  // these are the refs we'll be updating
  let userRef = database.ref(`/users/${uid}/frequencies/${frequencyKey}`);
  let frequencyRef = database.ref(`/frequencies/${frequencyKey}/users/${uid}`);

  // handle removing the frequency from the user record
  userRef.once('value').then(snapshot => {
    let frequency = snapshot.val();

    // make sure the user isn't the owner
    if (frequency.permission === 'owner') return;

    // if they're not, it's save to remove this node from the user's frequencies
    userRef.remove();
  });

  // handle removing the frequency from the user record
  frequencyRef.once('value').then(snapshot => {
    let user = snapshot.val();

    // make sure the user isn't the owner
    if (user.permission === 'owner') return;

    // if they're not, it's save to remove this node from the user's frequencies
    frequencyRef.remove();
  });
};

/*------------------------------------------------------------\*
*

toggleFrequencyPrivacy
Changes the boolean value of a frequencies privacy. We will run checks throughout the app to ensure the user always has the correct permissions when attempting to view a frequency with private set to 'true'

We need to ensure at this step that the user doing the toggling has permission, as indicated by being an owner in the frequency.

TODO: Move this permission check to Firebase Rules

*
\*------------------------------------------------------------*/
export const toggleFrequencyPrivacy = () => (dispatch, getState) => {
  let { database, frequencies, user } = setup(getState());

  // we'll compare user ids to make sure this action is allowed
  let uid = user.uid;

  // the frequency key we want to toggle on the server
  let frequencyKey = frequencies.active;

  // the frequency object which we use to check the current privacy
  let frequencyToUpdate = getCurrentFrequency(
    frequencyKey,
    frequencies.frequencies,
  );
  let isPrivate = frequencyToUpdate.settings.private;

  // we're going to first check the users ref to ensure the right permissions
  let frequencyUsersRef = database.ref(
    `/frequencies/${frequencyKey}/users/${uid}`,
  );
  // and if the permission looks good, we'll update the settings ref
  let frequencySettingsRef = database.ref(
    `/frequencies/${frequencyKey}/settings`,
  );

  // first we're going to check the users of this frequency
  frequencyUsersRef.once('value').then(snapshot => {
    let user = snapshot.val();

    // make sure the user is the owner, then toggle the privacy
    if (user.permission === 'owner') {
      frequencySettingsRef.update({
        private: !isPrivate,
      });
    }
  });
};
