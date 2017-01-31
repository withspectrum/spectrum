import * as firebase from 'firebase';
import { hashToArray } from '../helpers/utils'

export const setStories = () => (dispatch, getState) => {
  let stories = firebase.database().ref('stories')
  const activeFrequency = getState().frequencies.active

  stories.orderByChild('frequency').equalTo(activeFrequency).on('value', function(snapshot){
    const snapval = snapshot.val();
    if (!snapval) return true;
    // test to see if this is a snapshot of the full list
    let key = Object.keys(snapshot.val())[0];
    const stories = hashToArray(snapshot.val())
    if (snapshot.val()[key].creator){
      dispatch({
        type: 'SET_STORIES',
        stories: stories
      })
    }
  });
}

export const upvote = (storyId) => (dispatch, getState) => {
  const uid = getState().user.uid
  const upvote = {};
  upvote[`stories/${storyId}/upvotes/${uid}`] = true;
  firebase.database().ref().update(upvote, function(error){
    console.log(error);
  })
} 

export const createStory = (title, description, file) => (dispatch, getState) => {
  const user = getState().user
  const uid = user.uid
  const activeFrequency = getState().frequencies.active
  let newStoryRef = firebase.database().ref().child(`stories`).push();
  const key = newStoryRef.key

  // this if/else is messy. need to clean up in the future
  if (file) {
    let storage = firebase.storage().ref();
    storage.child(`story/${file.name}`).put(file).then(function(snapshot) {
      const imageUrl = snapshot.downloadURL
      let storyData = {
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
        frequency: activeFrequency
      }

      newStoryRef.set(storyData, function(err){
        console.log('err: ', err)
      });
    });
  } else {
    let storyData = {
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
        media: ''
      },
      frequency: activeFrequency
    }

    newStoryRef.set(storyData, function(err){
      console.log('err: ', err)
    });
  }

  dispatch({
    type: 'SET_ACTIVE_STORY',
    key
  })
}

export const setActiveStory = (id) => (dispatch) => {
  dispatch({
    type: 'SET_ACTIVE_STORY',
    id
  })
}
