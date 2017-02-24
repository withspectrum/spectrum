import * as firebase from 'firebase';
import { fetchStoriesForFrequencies } from '../helpers/stories';
import { createBrowserHistory } from 'history';

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

createStory


*
\*------------------------------------------------------------*/
export const publishStory = story => (dispatch, getState) => {
  dispatch({ type: 'LOADING' });

  let state = getState();
  let storyKey = state.composer.newStoryKey;
  const frequency = state.frequencies.frequencies.find(
    frequency => frequency.slug === state.frequencies.active,
  );
  let user = state.user;
  let uid = user.uid;

  let storyRef = firebase
    .database()
    .ref()
    .child(`stories/${frequency.id}/${storyKey}`);
  const messageRef = firebase.database().ref(`messages/${storyKey}`);

  let storyData = {
    id: storyKey, // we need this id again in the CREATE_STORY reducer
    published: true,
    timestamp: firebase.database.ServerValue.TIMESTAMP,
    frequency: frequency.id,
    content: {
      title: story.title,
      description: story.body,
    },
    creator: {
      displayName: user.displayName,
      photoURL: user.photoURL,
      uid,
    },
  };

  storyRef.update(storyData, err => {
    if (err) {
      console.log('there was an error publishing your story: ', err);
    } else {
      // Create the message storage for that story
      messageRef.set(
        {
          frequencyId: frequency.id,
        },
        err => {
          if (err) {
            console.log(
              'There was an error creating the messages for yor story',
              err,
            );
          } else {
            dispatch({
              type: 'CREATE_STORY',
              story: {
                ...storyData,
                // Timestamp is set on the server by Firebase, this simulates that by setting it to right
                // now
                timestamp: Date.now(),
              },
            });

            dispatch({
              type: 'TOGGLE_COMPOSER_OPEN',
              isOpen: false,
            });
          }
        },
      );
    }
  });
};

export const initStory = () => (dispatch, getState) => {
  return new Promise((resolve, reject) => {
    const state = getState();
    const user = state.user;
    const uid = user.uid;
    const frequency = state.frequencies.frequencies.find(
      frequency => frequency.slug === state.frequencies.active,
    );
    const newStoryRef = firebase
      .database()
      .ref()
      .child(`stories/${frequency.id}`)
      .push();
    const newStoryKey = newStoryRef.key;

    let draft = {
      id: newStoryKey,
      published: false,
      timestamp: firebase.database.ServerValue.TIMESTAMP,
      frequency: frequency.id,
      creator: {
        displayName: user.displayName,
        photoURL: user.photoURL,
        uid,
      },
    };

    newStoryRef.set(draft, err => {
      if (err) {
        console.log('there was an error creating the draft: ', err);
      } else {
        dispatch({
          type: 'CREATE_DRAFT',
          newStoryKey,
        });

        resolve();
      }
    });
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
