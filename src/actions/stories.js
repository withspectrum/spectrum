import { createBrowserHistory } from 'history';
import { track } from '../EventTracker';
import {
  createDraft,
  createStory,
  removeStory,
  setStoryLock,
  listenToStory,
  stopListening,
} from '../db/stories';
import { getMessages, getMessage } from '../db/messages';
import { getCurrentFrequency } from '../helpers/frequencies';
import { markMessagesRead } from '../db/notifications';

/**
 * Publish a drafted story
 */
export const publishStory = ({ frequencyId, title, description }) => (
  dispatch,
  getState,
) => {
  dispatch({ type: 'LOADING' });

  let state = getState();
  let storyKey = state.composer.newStoryKey;
  const frequency = getCurrentFrequency(
    frequencyId,
    state.frequencies.frequencies,
  );

  createStory({ key: storyKey, frequency, content: { title, description } })
    .then(story => {
      track('story', 'created', null);

      dispatch({
        type: 'CREATE_STORY',
        story,
      });

      const history = createBrowserHistory();
      history.push(`/~${state.frequencies.active}/${storyKey}`);

      dispatch(setActiveStory(storyKey));
    })
    .catch(err => {
      console.log(err);
    });
};

/**
 * Initialise a story by creating a draft on the server
 *
 * Pass a frequency ID as the first (and only) argument if there's no active frequency, otherwise we take the active one
 */
export const initStory = freqId => (dispatch, getState) => {
  const { user, frequencies: { frequencies, active } } = getState();
  const frequencyId = freqId ||
    frequencies.find(freq => freq.slug === active).id;

  createDraft({ user, frequencyId })
    .then(key => {
      track('draft', 'created', null);
      dispatch({
        type: 'CREATE_DRAFT',
        key,
      });
    })
    .catch(err => {
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
  getMessages(story)
    .then(messages => {
      dispatch({ type: 'ADD_MESSAGES', messages });
    })
    .catch(err => {
      console.log(err);
      dispatch({ type: 'STOP_LOADING' });
    });

  markMessagesRead(story, getState().user.uid);

  if (listener) stopListening(listener);
  listener = listenToStory(story, story => {
    if (!story.messages) return;
    const existingMessages = getState().messages.messages.map(
      message => message.id,
    );
    // Get all messages that aren't in the store yet
    const messages = Object.keys(story.messages)
      .filter(message => existingMessages.indexOf(message));
    Promise.all(messages.map(message => getMessage(message))).then(messages => {
      dispatch({
        type: 'ADD_MESSAGES',
        messages,
      });
    });
  });
};

/**
 * Delete a story
 */
export const deleteStory = id => (dispatch, getState) => {
  dispatch({ type: 'LOADING' });
  const { frequencies, stories } = getState();
  let activeFrequency = frequencies.active;
  const { frequencyId } = stories.stories.find(story => story.id === id);

  removeStory({ storyId: id, frequencyId })
    .then(() => {
      track('story', 'deleted', null);

      dispatch({
        type: 'DELETE_STORY',
        id,
      });
      const history = createBrowserHistory();
      // redirect the user so that they don't end up on a broken url
      if (activeFrequency && activeFrequency !== 'all') {
        history.push(`/~${activeFrequency}`);
      } else {
        history.push('/');
      }
    })
    .catch(err => {
      console.log(err);
      dispatch({ type: 'STOP_LOADING' });
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
      track('story', 'lock toggled', null);

      dispatch({
        type: 'TOGGLE_STORY_LOCK',
        id,
        locked,
      });
    })
    .catch(err => {
      console.log(err);
      dispatch({ type: 'STOP_LOADING' });
    });
};
