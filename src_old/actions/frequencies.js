// @flow
import history from '../helpers/history';
import { getCurrentFrequency } from '../helpers/frequencies';
import { flattenArray, arrayToHash } from '../helpers/utils';
import { track } from '../EventTracker';
import {
  saveNewFrequency,
  removeFrequency,
  updateFrequency,
  addUserToFrequency,
  removeUserFromFrequency,
  getFrequency,
} from '../db/frequencies';
import { getStories } from '../db/stories';
import { getUserInfo } from '../db/users';
import { getCommunity } from '../db/communities';
import { throwError } from './errors';

export const setActiveFrequency = frequency => (dispatch, getState) => {
  const lowerCaseFrequency = frequency ? frequency.toLowerCase() : '';

  dispatch({
    type: 'SET_ACTIVE_FREQUENCY',
    frequency: lowerCaseFrequency,
  });

  dispatch({ type: 'LOADING' });
  const { communities: { active } } = getState();

  if (
    !active ||
    active === 'everything' ||
    active === 'explore' ||
    active === 'messages'
  ) {
    dispatch({ type: 'STOP_LOADING' });
    return;
  }
  track('frequency', 'viewed', null);
  // Get the frequency
  getFrequency({ slug: lowerCaseFrequency, communitySlug: active })
    .then(data => Promise.all([data, getCommunity({ id: data.communityId })]))
    .then(([data, community]) => {
      dispatch({
        type: 'ADD_COMMUNITY',
        community,
      });
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
      return getStories({ frequencyId: data.id });
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
                    (!story.participants
                      ? undefined
                      : Object.keys(story.participants).map(participant =>
                          getUserInfo(participant)
                        ))
                )
                .filter(elem => !!elem)
            )
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
      dispatch(throwError(err, { stopLoading: true }));
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
      dispatch(throwError(err, { stopLoading: true }));
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
      dispatch(throwError(err, { stopLoading: true }));
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
      dispatch(throwError(err, { stopLoading: true }));
    });
};

type FrequencyData = {
  frequencyId?: string,
  communityId?: string,
  frequencySlug?: string,
  communitySlug?: string,
};

export const subscribeFrequency = (
  data: FrequencyData,
  redirect: boolean = true
) => (dispatch: Function, getState: Function) => {
  const { user: { uid } } = getState();
  dispatch({ type: 'LOADING' });

  addUserToFrequency(uid, data)
    .then(([frequency, community]) => {
      track('frequency', 'subscribed', null);

      if (redirect) {
        history.push(`/${community.slug}/~${frequency.slug}`);
      }

      dispatch({
        type: 'SUBSCRIBE_FREQUENCY',
        uid,
        frequency,
      });
    })
    .catch(err => {
      dispatch(throwError(err, { stopLoading: true }));
    });
};

export const unsubscribeFrequency = (frequencySlug: string) => (
  dispatch: Function,
  getState: Function
) => {
  const {
    user: { uid },
    frequencies,
    communities: { active, communities },
  } = getState();

  const community = communities.find(community => community.slug === active);

  // we'll use this key to update the user record and to find the correct frequency record to update
  const id = getCurrentFrequency(
    frequencySlug,
    frequencies.frequencies,
    community.id
  ).id;

  dispatch({ type: 'LOADING' });

  removeUserFromFrequency(uid, id)
    .then(([frequency, community]) => {
      track('frequency', 'unsubscribed', null);
      history.push(`/${community.slug}/~${frequency.slug}`);

      dispatch({
        type: 'UNSUBSCRIBE_FREQUENCY',
        uid,
        id,
      });
    })
    .catch(err => {
      dispatch(throwError(err, { stopLoading: true }));
    });
};
