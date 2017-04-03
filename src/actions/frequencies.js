import history from '../helpers/history';
import { getCurrentFrequency } from '../helpers/frequencies';
import { flattenArray, arrayToHash, logException } from '../helpers/utils';
import { track } from '../EventTracker';
import {
  saveNewFrequency,
  removeFrequency,
  updateFrequency,
  addUserToFrequency,
  removeUserFromFrequency,
  getFrequency,
} from '../db/frequencies';
import { getStories, getAllStories } from '../db/stories';
import { getUserInfo } from '../db/users';
import { getNotifications } from '../db/notifications';

export const setActiveFrequency = frequency => (dispatch, getState) => {
  const lowerCaseFrequency = frequency.toLowerCase();

  dispatch({
    type: 'SET_ACTIVE_FREQUENCY',
    frequency: lowerCaseFrequency,
  });

  dispatch({ type: 'LOADING' });
  const { user: { uid } } = getState();
  // Notifications
  if (lowerCaseFrequency === 'notifications') {
    if (!uid) return;
    track('notifications', 'viewed', null);
    getNotifications(uid)
      .then(notifications => {
        dispatch({
          type: 'SET_NOTIFICATIONS',
          notifications,
        });
      })
      .catch(err => {
        logException(err);
      });
    return;
  }
  // Everything
  if (lowerCaseFrequency === 'everything') {
    // If there's no UID yet we might need to show the homepage, so don't do anything
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
        logException(err);
        dispatch({ type: 'STOP_LOADING' });
      });
    return;
  }
  track('frequency', 'viewed', null);
  // Get the frequency
  getFrequency({ slug: lowerCaseFrequency })
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
      return getStories({ frequencySlug: lowerCaseFrequency });
    })
    .then(stories => {
      if (!stories) {
        dispatch({ type: 'STOP_LOADING' });
      } else {
        return Promise.all([
          stories,
          // Get all the particpants on the story
          Promise.all(
            flattenArray(
              stories
                .map(
                  story =>
                    !story.participants
                      ? undefined
                      : Object.keys(story.participants)
                          .map(participant => getUserInfo(participant)),
                )
                .filter(elem => !!elem),
            ),
          ),
        ]);
      }
    })
    .then(data => {
      if (!data) return;
      const [stories, users] = data;
      dispatch({
        type: 'ADD_STORIES',
        stories,
        users: arrayToHash(users, 'uid'),
      });
    })
    .catch(err => {
      logException(err);
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
      history.push(`/~${frequency.slug}`);
    })
    .catch(err => {
      dispatch({ type: 'HIDE_MODAL' });
      dispatch({ type: 'STOP_LOADING' });
      logException(err);
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
      logException(err);
      dispatch({ type: 'STOP_LOADING' });
    });
};

export const deleteFrequency = id => (dispatch, getState) => {
  dispatch({ type: 'LOADING' });
  removeFrequency(id)
    .then(() => {
      track('frequency', 'deleted', null);
      history.push('/');
      dispatch({ type: 'DELETE_FREQUENCY', id });
    })
    .catch(err => {
      dispatch({ type: 'HIDE_MODAL' });
      dispatch({ type: 'STOP_LOADING' });
      logException(err);
    });
};

export const subscribeFrequency = (slug, redirect) => (dispatch, getState) => {
  const { user: { uid } } = getState();
  dispatch({ type: 'LOADING' });

  addUserToFrequency(uid, slug)
    .then(frequency => {
      track('frequency', 'subscribed', null);

      if (redirect !== false) {
        history.push(`/~${frequency.slug || frequency.id}`);
      }

      dispatch({
        type: 'SUBSCRIBE_FREQUENCY',
        uid,
        frequency,
      });
    })
    .catch(err => {
      dispatch({ type: 'STOP_LOADING' });
      logException(err);
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
      history.push(`/~${frequency}`);

      dispatch({
        type: 'UNSUBSCRIBE_FREQUENCY',
        uid,
        id,
      });
    })
    .catch(err => {
      dispatch({ type: 'STOP_LOADING' });
      logException(err);
    });
};
