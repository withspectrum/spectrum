import * as firebase from 'firebase';
import { fetchStoriesForFrequencies } from '../helpers/stories';
import { createBrowserHistory } from 'history';
import { createDraft, createStory } from '../db/stories';

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

export const setActiveStory = story => ({
  type: 'SET_ACTIVE_STORY',
  story,
});

export const deleteStory = id => (dispatch, getState) => {
  dispatch({ type: 'LOADING' });
  const { frequencies, stories } = getState();
  let activeFrequency = frequencies.active;
  const frequencyId = stories.stories.find(story => story.id === id).frequency;

  firebase.database().ref(`/stories/${frequencyId}/${id}`).remove(); // delete the story
  firebase.database().ref(`/messages/${id}`).remove(); // delete the messages for the story

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
};

export const toggleLockedStory = story => dispatch => {
  dispatch({ type: 'LOADING' });
  const id = story.id;
  const locked = story.locked ? story.locked : false; // if we haven't set a 'locked' status on the story, it defaults to false (which means people can write messages)

  firebase.database().ref(`/stories/${id}`).update({
    locked: !locked,
  });

  dispatch({
    type: 'TOGGLE_STORY_LOCK',
    id,
    locked,
  });
};
