import * as firebase from 'firebase'
import helpers from '../helpers'

/*------------------------------------------------------------\*
*             

setup
Takes getState() as an only argument. The reason we do this is so that in any future
actions or functions, we can easily destructure the returned object of setup() to get
any necessary bits of data about the current state of the app

*
\*------------------------------------------------------------*/
export const setup = (stateFetch) => {
  let state = stateFetch
  let frequencies = state.frequencies
  let stories = state.stories
  let user = state.user
  let uid = user.uid

  // return an object that we can destructure in future functions
  return {
    database: firebase.database(), // we're also including the database so we don't have to keep defining it elsewhere
    state,
    frequencies,
    stories,
    user,
    uid
  }
}


/*------------------------------------------------------------\*
*             

setup
Takes getState() as an only argument. The reason we do this is so that in any future
actions or functions, we can easily destructure the returned object of setup() to get
any necessary bits of data about the current state of the app

*
\*------------------------------------------------------------*/
export const setStories = () => (dispatch, getState) => {
  let { user } = setup(getState())
  console.log('we are going to set the stories')
  let userFrequencies = user.frequencies
  console.log('we have a user ', user)
  if (!user.uid) return
  console.log('the user exists')
  let mapStoryGroupsToArray = (storyGroups) => {
    console.log('we have mapped out the stories')
    return new Promise((resolve, reject) => {
        let storiesArray = []

        // for each group of stories (grouped by frequency ID)
        storyGroups.map((group) => {
          // loop through each story in that group
          for (let i in group) {
            // and push it to our return array
            storiesArray.push(group[i])
          }
        })
        
        // once this is done, we can resolve the promise with our flattened array
        resolve(storiesArray)
    })
  }

  helpers.fetchStoriesForFrequencies(userFrequencies)
  .then((storiesGroupedByFrequency) => {
    console.log('we have fetched stories', storiesGroupedByFrequency)
    /*  this returns an array of arrays
        it looks like this:
        [
          frequencyIdA: [{story}, {story}, ...],
          frequencyIdB: [{story}, {story}, ...]
        ]

        Because of this structure, we need to iterate through this nested array and destructure it into one flat array containing all the stories
    */ 
    return mapStoryGroupsToArray(storiesGroupedByFrequency)
  }).then((stories) => {
    console.log('we are dispatching the stories', stories)
    // we now have all the stories fetched from each frequency the user is a member of in a flattened array. We can send this to the ui and filter by frequency based on active frequency
    
    dispatch({
      type: 'SET_STORIES',
      stories
    })
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
        frequency: frequency
      }

      newStoryRef.set(storyData, function(err){
        console.log('err 1: ', err)
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
      frequency: frequency
    }

    newStoryRef.set(storyData, function(err){
      if (err) {
        console.log('there was an error saving your story: ', err)
      } else {
        console.log('here with ', key)
        dispatch({
          type: 'SET_ACTIVE_STORY',
          id: key
        })
      }
    });
  }

  dispatch({
    type: 'TOGGLE_COMPOSER_OPEN',
    isOpen: false
  })
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

export const deleteStory = (id) => (dispatch, getState) => {
  firebase.database().ref(`/stories/${id}`).remove() // delete the story
  firebase.database().ref(`/messages/${id}`).remove() // delete the messages for the story

  let activeFrequency = getState().frequencies.active

  dispatch({
    type: 'DELETE_STORY',
    id
  })

  dispatch({
    type: 'CLEAR_MESSAGES',
    messages: ''
  })

  // redirect the user so that they don't end up on a broken url
  if (activeFrequency && activeFrequency !== "all") {
    window.location.href = `/${activeFrequency}`
  } else { 
    window.location.href = '/'
  }
}

export const toggleLockedStory = (story) => (dispatch) => {
  const id = story.id
  const locked = story.locked ? story.locked : false // if we haven't set a 'locked' status on the story, it defaults to false (which means people can write messages)

  firebase.database().ref(`/stories/${id}`).update({
    locked: !locked
  })

  dispatch({
    type: 'TOGGLE_STORY_LOCK',
    id,
    locked
  })
}

export default {
  setStories,
  upvote,
  createStory,
  setActiveStory,
  deleteStory,
  toggleLockedStory
}
