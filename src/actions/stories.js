import { createBrowserHistory } from 'history';
import {
  createDraft,
  createStory,
  removeStory,
  setStoryLock,
} from '../db/stories';
import { getMessages } from '../db/messages';

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

  createStory({ key: storyKey, frequencyId, content: { title, description } })
    .then(story => {
      dispatch({
        type: 'CREATE_STORY',
        story,
      });
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
      dispatch({
        type: 'CREATE_DRAFT',
        key,
      });
    })
    .catch(err => {
      console.log(err);
    });
};

export const setActiveStory = story => (dispatch, getState) => {
  dispatch({
    type: 'SET_ACTIVE_STORY',
    story,
  });
  dispatch({ type: 'LOADING' });
  getMessages(story)
    .then(messages => {
      dispatch({ type: 'ADD_MESSAGES', messages });
    })
    .catch(err => {
      console.log(err);
      dispatch({ type: 'STOP_LOADING' });
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

  setStoryLock({ id, locked })
    .then(() => {
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
