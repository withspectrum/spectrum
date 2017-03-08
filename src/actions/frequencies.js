import { createBrowserHistory } from 'history';
import { getCurrentFrequency } from '../helpers/frequencies';
import { track } from '../EventTracker';
import {
  saveNewFrequency,
  removeFrequency,
  updateFrequency,
  addUserToFrequency,
  removeUserFromFrequency,
  getFrequency,
} from '../db/frequencies';
const history = createBrowserHistory();
import { getStories, getAllStories } from '../db/stories';

export const setActiveFrequency = frequency => (dispatch, getState) => {
  dispatch({
    type: 'SET_ACTIVE_FREQUENCY',
    frequency,
  });
  // Notifications
  if (frequency === 'notifications') {
    track('notifications', 'viewed', null);
    return;
  }

  dispatch({ type: 'LOADING' });
  // Everything
  if (frequency === 'everything') {
    // If there's no UID yet we might need to show the homepage, so don't do anything
    const { user: { uid } } = getState();
    if (!uid) return;
    track('everything', 'viewed', null);
    // Get all the stories from all the frequencies
    getAllStories(uid)
      .then(stories => {
        dispatch({
          type: 'ADD_STORIES',
          stories,
        });
      })
      .catch(err => {
        console.log(err);
        dispatch({ type: 'STOP_LOADING' });
      });
    return;
  }
  track('frequency', 'viewed', null);
  // Get the frequency
  getFrequency({ slug: frequency })
    .then(data => {
      dispatch({
        type: 'ADD_FREQUENCY',
        frequency: data,
      });
      return data;
    })
    .then(data => {
      const freqs = getState().user.frequencies;
      // If it's a private frequency, don't even get any stories
      if (data && data.settings.private && (!freqs || !freqs[data.id]))
        return [];
      return getStories({ frequencySlug: frequency });
    })
    .then(stories => {
      dispatch({
        type: 'ADD_STORIES',
        stories,
      });
    })
    .catch(err => {
      console.log(err);
      dispatch({ type: 'STOP_LOADING' });
    });
};

// NOTE: We do not dispatch anything in this action because we have an open listener to any changes in the frequencies in <Root />
export const createFrequency = data => (dispatch, getState) => {
  dispatch({ type: 'LOADING' });

  const { user: { uid } } = getState();
  saveNewFrequency({ uid, data })
    .then(frequency => {
      track('frequency', 'created', null);

      dispatch({
        type: 'CREATE_FREQUENCY',
        frequency,
      });
      history.push(`~${frequency.slug}`);
    })
    .catch(err => {
      dispatch({ type: 'HIDE_MODAL' });
      console.log(err);
    });
};

export const editFrequency = data => (dispatch, getState) => {
  dispatch({ type: 'LOADING' });

  updateFrequency(data)
    .then(() => {
      track('frequency', 'edited', null);

      dispatch({
        type: 'EDIT_FREQUENCY',
        frequency: data,
      });
    })
    .catch(err => {
      console.log(err);
    });
};

export const deleteFrequency = id => (dispatch, getState) => {
  dispatch({ type: 'LOADING' });
  removeFrequency(id)
    .then(() => {
      track('frequency', 'deleted', null);
      history.push('/~hugs-n-bugs');
      dispatch({ type: 'DELETE_FREQUENCY', id });
    })
    .catch(err => {
      dispatch({ type: 'HIDE_MODAL' });
      console.log(err);
    });
};

export const subscribeFrequency = slug => (dispatch, getState) => {
  const { user: { uid } } = getState();
  dispatch({ type: 'LOADING' });

  addUserToFrequency(uid, slug)
    .then(frequency => {
      track('frequency', 'subscribed', null);

      dispatch({
        type: 'CREATE_FREQUENCY',
        frequency,
      });
    })
    .catch(err => {
      dispatch({ type: 'STOP_LOADING' });
      console.log(err);
    });
};

export const unsubscribeFrequency = frequency => (dispatch, getState) => {
  const { user: { uid }, frequencies } = getState();

  // we'll use this key to update the user record and to find the correct frequency record to update
  const id = getCurrentFrequency(frequency, frequencies.frequencies).id;

  dispatch({ type: 'LOADING' });

  removeUserFromFrequency(uid, id)
    .then(() => {
      track('frequency', 'unsubscribed', null);

      dispatch({
        type: 'UNSUBSCRIBE_FREQUENCY',
        id,
      });
    })
    .catch(err => {
      dispatch({ type: 'STOP_LOADING' });
      console.log(err);
    });
};
