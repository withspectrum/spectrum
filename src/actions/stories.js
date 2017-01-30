import * as firebase from 'firebase';
import { hashToArray } from '../helpers/utils'

export const setStories = () => (dispatch, getState) => {
  let stories = firebase.database().ref('stories')
  const activeFrequency = getState().frequencies.active

  stories.orderByChild('frequency').equalTo(activeFrequency).on('value', function(snapshot){
    const stories = hashToArray(snapshot.val())
    dispatch({
      type: 'SET_STORIES',
      stories: stories
    })
  });
}

export const createStory = (title, description, file) => (dispatch, getState) => {
  const uid = getState().user.uid
  const activeFrequency = getState().frequencies.active
  const timestamp = Math.round(new Date() / 1);
  let newStoryRef = firebase.database().ref().child(`stories`).push();
  const key = newStoryRef.key

  // this if/else is messy. need to clean up in the future
  if (file) {
    let storage = firebase.storage().ref();
    storage.child(`story/${file.name}`).put(file).then(function(snapshot) {
      console.log(snapshot.downloadURL)
      let storyData = {
        id: key,
        creator: uid,
        timestamp: timestamp,
        content: {
          title: title,
          description: description,
          media: snapshot.downloadURL
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
      creator: uid,
      timestamp: timestamp,
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