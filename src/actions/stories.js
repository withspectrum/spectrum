import * as firebase from 'firebase'
import helpers from '../helpers'

export const setStories = () => (dispatch, getState) => {
  let usersFrequencies = getState().user.frequencies
  const activeFrequency = getState().frequencies.active
  let stories = firebase.database().ref(`stories`)

  if (activeFrequency === "all" && usersFrequencies) { // we want stories for all a user's frequencies
    let storiesToReturn = []
    helpers.fetchStoriesForFrequencies(usersFrequencies).then(function(freq){
      freq.forEach(function(f){
        let a = helpers.hashToArray(f)
        a.forEach(function(item){
          storiesToReturn.push(item)
        })
      })
      dispatch({
        type: 'SET_STORIES',
        stories: storiesToReturn
      })
    })
    return true;
  }

  // if the active frequency doesn't equal 'all', just get the stories for the single selected frequency
  stories.orderByChild('frequency').equalTo(activeFrequency).on('value', function(snapshot){
    const snapval = snapshot.val();

    // if there aren't stories for this frequency, clear the stories from state
    if (!snapval) {
      dispatch({
        type: 'SET_STORIES',
        stories: []
      })

      dispatch({
        type: 'SET_ACTIVE_STORY',
        id: ''
      })

      return
    };
    // test to see if this is a snapshot of the full list
    let key = Object.keys(snapshot.val())[0];
    const stories = helpers.hashToArray(snapshot.val())
    if (snapshot.val()[key].creator){
      dispatch({
        type: 'SET_STORIES',
        stories: stories
      })
    }
  });
}

export const setActiveStory = (id) => (dispatch) => {
  dispatch({
    type: 'SET_ACTIVE_STORY',
    id
  })

  dispatch({
    type: 'CLEAR_MESSAGES',
    mesages: ''
  })
}

export const upvote = (storyId) => (dispatch, getState) => {
  const uid = getState().user.uid
  const upvote = {};
  upvote[`stories/${storyId}/upvotes/${uid}`] = true;
  firebase.database().ref().update(upvote, function(error){
    console.log('err upvote: ', error);
  })
} 

export const createStory = (frequency, title, description, file) => (dispatch, getState) => {
  const user = getState().user
  const uid = user.uid
  let newStoryRef = firebase.database().ref().child(`stories`).push();
  const key = newStoryRef.key

  function buildStoryData(imageUrl){
    return {
      id: key,
      creator: {
        displayName: user.displayName,
        photoURL: user.photoURL,
        uid
      },
      timestamp: firebase.database.ServerValue.TIMESTAMP,
      content: {
        title: title,
        description: description,
        media: imageUrl
      },
      frequency: frequency
    }
  }

  let storyData = buildStoryData();
  newStoryRef.set(storyData, function(err){
    console.log('err 2: ', err)
    setActiveStory(key)
  });

  if (file) {
    // create a file storage ref
    let storage = firebase.storage().ref();
    storage.child(`story/${file.name}`).put(file).then(function(snapshot) {
      const imageUrl = snapshot.downloadURL
      let storyData = buildStoryData(imageUrl);
      newStoryRef.update(storyData, function(err){
        console.log('err 1: ', err)
      });
    });
  }

  dispatch({
    type: 'TOGGLE_COMPOSER_OPEN',
    isOpen: false
  })
}

export default {
  setStories,
  upvote,
  createStory,
  setActiveStory
}
