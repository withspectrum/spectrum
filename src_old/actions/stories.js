//@flow
import history from '../helpers/history';
import { track } from '../EventTracker';
import {
  createDraft,
  createStory,
  removeStory,
  setStoryLock,
  listenToStory,
  stopListening,
  getStory,
  editStory,
} from '../db/stories';
import { getUserInfo } from '../db/users';
import { getMessagesFromLocation, getMessage } from '../db/messages';
import { getCurrentFrequency, linkFreqsInMd } from '../helpers/frequencies';
import { arrayToHash } from '../helpers/utils';
import { markStoryRead } from '../db/notifications';
import { throwError } from './errors';

/**
 * Initialise a story by creating a draft on the server
 *
 * Pass a frequency ID as the first (and only) argument if there's no active frequency, otherwise we take the active one
 */
export const initStory = freqId => (dispatch, getState) => {
  const { user, frequencies: { frequencies, active } } = getState();
  const frequencyId =
    freqId || frequencies.find(freq => freq.slug === active).id;

  createDraft({ user, frequencyId })
    .then(key => {
      track('draft', 'created', null);
      dispatch({
        type: 'CREATE_DRAFT',
        key,
      });
    })
    .catch(err => {
      dispatch(throwError(err));
    });
};

export const initEditStory = story => (dispatch, getState) => {
  track('story edit', 'inited', null);

  dispatch({
    type: 'INIT_EDIT_STORY',
    story,
  });
};

export const cancelEditStory = () => (dispatch, getState) => {
  track('story edit', 'canceled', null);

  dispatch({
    type: 'CANCEL_EDIT_STORY',
  });
};

/**
 * Edit a published story
 */
export const saveEditStory = ({ title, description, metadata }) => (
  dispatch,
  getState
) => {
  dispatch({ type: 'LOADING' });

  let state = getState();
  let storyKey = state.composer.newStoryKey;

  editStory({
    key: storyKey,
    content: {
      title,
      description: linkFreqsInMd(description, state.communities.active),
    },
    metadata,
  })
    .then(story => {
      track('story edit', 'saved', null);

      dispatch({
        type: 'EDIT_STORY',
        story,
      });

      dispatch({
        type: 'STOP_LOADING',
      });

      if (state.communities.active === 'everything') {
        history.push(`/${state.communities.active}/${storyKey}`);
      } else {
        history.push(
          `/${state.communities.active}/~${state.frequencies.active}/${storyKey}`
        );
      }
    })
    .catch(err => {
      dispatch({
        type: 'STOP_LOADING',
      });
      console.log(err);
    });
};

let listener;
export const setActiveStory = story => (dispatch, getState) => {
  dispatch({
    type: 'SET_ACTIVE_STORY',
    story,
  });
  if (!story) return;

  track('story', 'viewed', null);

  dispatch({ type: 'LOADING' });
  const { stories: { stories } } = getState();
  let promise = Promise.resolve();
  if (!stories.find(existing => existing.id === story)) {
    promise = getStory(story)
      .then(story => {
        dispatch({ type: 'ADD_STORY', story });
      })
      .catch(err => {
        dispatch(throwError(err));
      });
  }
  promise
    .then(getMessagesFromLocation('stories', story))
    .then(messages => {
      if (!messages) {
        dispatch({ type: 'STOP_LOADING' });
      } else {
        return Promise.all([
          messages,
          // Get all the users that sent messages
          Promise.all(messages.map(message => getUserInfo(message.userId))),
        ]);
      }
    })
    .then(data => {
      if (!data) return;
      const [messages, users] = data;

      dispatch({
        type: 'ADD_MESSAGES',
        messages,
        users: arrayToHash(users, 'uid'),
      });
    })
    .catch(err => {
      dispatch(throwError(err, { stopLoading: true }));
    });

  markStoryRead(story, getState().user.uid);

  if (listener) stopListening(listener);
  listener = listenToStory(story, story => {
    dispatch({
      type: 'UPDATE_STORY',
      story,
    });

    if (!story || !story.messages) return;
    // Get all messages that aren't in the store yet
    const messages = Object.keys(story.messages);

    Promise.all(messages.map(message => getMessage('messages', message)))
      .then(messages => {
        if (!messages) {
          return;
        }
        return Promise.all([
          messages,
          // Get all the users that sent messages
          Promise.all(messages.map(message => getUserInfo(message.userId))),
        ]);
      })
      .then(data => {
        if (!data) return;
        const [messages, users] = data;
        dispatch({
          type: 'ADD_MESSAGES',
          messages,
          users: arrayToHash(users, 'uid'),
        });
      })
      .catch(err => {
        dispatch(throwError(err));
      });
  });
};

/**
 * Publish a drafted story
 */
export const publishStory = ({ frequencyId, title, description, metadata }) => (
  dispatch,
  getState
) => {
  dispatch({ type: 'LOADING' });

  let state = getState();
  let storyKey = state.composer.newStoryKey;
  const frequency = getCurrentFrequency(
    frequencyId,
    state.frequencies.frequencies
  );

  createStory({
    key: storyKey,
    frequency,
    content: {
      title,
      description: linkFreqsInMd(description, state.communities.active),
    },
    metadata,
  })
    .then(story => {
      track('story', 'created', null);

      dispatch({
        type: 'CREATE_STORY',
        story,
      });
      if (state.communities.active === 'everything') {
        history.push(`/${state.communities.active}/${storyKey}`);
      } else {
        history.push(
          `/${state.communities.active}/~${frequency.slug}/${storyKey}`
        );
      }

      dispatch(setActiveStory(storyKey));
    })
    .catch(err => {
      dispatch(throwError(err, { stopLoading: true }));
    });
};

/**
 * Delete a story
 */
export const deleteStory = id => (dispatch, getState) => {
  dispatch({ type: 'LOADING' });
  const { frequencies, communities, stories } = getState();
  let activeFrequency = frequencies.active;
  const { frequencyId } = stories.stories.find(story => story.id === id);

  removeStory({ storyId: id, frequencyId })
    .then(() => {
      track('story', 'deleted', null);

      dispatch({
        type: 'DELETE_STORY',
        id,
      });
      // redirect the user so that they don't end up on a broken url
      if (activeFrequency) {
        history.push(`/${communities.active}/~${activeFrequency}`);
      } else {
        history.push(`/${communities.active}`);
      }
    })
    .catch(err => {
      dispatch(throwError(err, { stopLoading: true }));
    });
};

/**
 * Toggle the locked status of a story
 */
export const toggleLockedStory = story => dispatch => {
  dispatch({ type: 'LOADING' });
  const id = story.id;
  const locked = story.locked ? story.locked : false; // if we haven't set a 'locked' status on the story, it defaults to false (which means people can write messages)

  setStoryLock({ id, locked: !locked })
    .then(() => {
      track('story', `${locked ? 'unlocked' : 'locked'}`, null);

      dispatch({
        type: 'TOGGLE_STORY_LOCK',
        id,
        locked,
      });
    })
    .catch(err => {
      dispatch(throwError(err, { stopLoading: true }));
    });
};
