import * as firebase from 'firebase';
import helpers from '../helpers';

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

setStories
1. Get all the frequencies the user is subscribed to
2. Return all the stories on the server for each of those frequencies
3. Sort and filter all of those stories on the frontend

*
\*------------------------------------------------------------*/
export const setStories = () => (dispatch, getState) => {
  let { user } = setup(getState());
  let userFrequencies = user.frequencies;

  if (!user.uid) return;

  let mapStoryGroupsToArray = storyGroups => {
    return new Promise((resolve, reject) => {
      let storiesArray = [];

      // for each group of stories (grouped by frequency ID)
      storyGroups.map(group => {
        // loop through each story in that group
        for (let i in group) {
          // and push it to our return array
          storiesArray.push(group[i]);
        }
      });

      // once this is done, we can resolve the promise with our flattened array
      resolve(storiesArray);
    });
  };

  helpers
    .fetchStoriesForFrequencies(userFrequencies)
    .then(storiesGroupedByFrequency => {
      /*  this returns an array of arrays
        it looks like this:
        [
          frequencyIdA: [{story}, {story}, ...],
          frequencyIdB: [{story}, {story}, ...]
        ]

        Because of this structure, we need to iterate through this nested array and destructure it into one flat array containing all the stories
    */
      return mapStoryGroupsToArray(storiesGroupedByFrequency);
    })
    .then(stories => {
      // we now have all the stories fetched from each frequency the user is a member of in a flattened array. We can send this to the ui and filter by frequency based on active frequency

      dispatch({
        type: 'SET_STORIES',
        stories,
      });
    });
};

/*------------------------------------------------------------\*
*

createStory


*
\*------------------------------------------------------------*/
export const publishStory = (story) => (
  dispatch,
  getState,
) => {
  return new Promise((resolve, reject) => {
    let state = getState()
    let storyKey = state.composer.newStoryKey
    let user = state.user
    let uid = user.uid

    let storyRef = firebase.database().ref().child(`stories/${storyKey}`);
    
    let storyData = {
      id: storyKey, // we need this id again in the CREATE_STORY reducer
      published: true,
      timestamp: firebase.database.ServerValue.TIMESTAMP,
      content: {
        title: story.title,
        description: story.body
      },
      creator: {
        displayName: user.displayName,
        photoURL: user.photoURL,
        uid,
      },
      frequency: story.frequency,
    };

    storyRef.update(storyData, err => {
      if (err) {
        console.log('there was an error publishing your story: ', err);
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

        resolve()
      }
    });

  })
};

export const initStory = () => (dispatch, getState) => {
  return new Promise((resolve, reject) => {
    let state = getState()
    let user = state.user
    let uid = user.uid
    let newStoryRef = firebase.database().ref().child('stories').push();
    let newStoryKey = newStoryRef.key;

    let draft = {
      id: newStoryKey,
      published: false,
      timestamp: firebase.database.ServerValue.TIMESTAMP,
      creator: {
        displayName: user.displayName,
        photoURL: user.photoURL,
        uid,
      }
    };

    newStoryRef.set(draft, err => {
      if (err) {
        console.log('there was an error creating the draft: ', err);
      } else {
        dispatch({
          type: 'CREATE_DRAFT',
          newStoryKey
        });

        resolve()
      }
    });
  })
}

export const setActiveStory = id => ({
  type: 'SET_ACTIVE_STORY',
  id,
});

export const deleteStory = id => (dispatch, getState) => {
  firebase.database().ref(`/stories/${id}`).remove(); // delete the story
  firebase.database().ref(`/messages/${id}`).remove(); // delete the messages for the story

  let activeFrequency = getState().frequencies.active;

  dispatch({
    type: 'DELETE_STORY',
    id,
  });

  // redirect the user so that they don't end up on a broken url
  if (activeFrequency && activeFrequency !== 'all') {
    window.location.href = `/${activeFrequency}`;
  } else {
    window.location.href = '/';
  }
};

export const toggleLockedStory = story => dispatch => {
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

export default {
  setStories,
  initStory,
  publishStory,
  setActiveStory,
  deleteStory,
  toggleLockedStory,
};
