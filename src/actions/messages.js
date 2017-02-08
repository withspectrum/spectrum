import * as firebase from 'firebase';
import helpers from '../helpers'
import fetch from 'whatwg-fetch-importable'
import Autolinker from 'autolinker'

export const clearMessages = () => (dispatch) => {
  // totally wipes messages from store
  dispatch({ type: 'CLEAR_MESSAGES' })
}

export const setMessages = () => (dispatch, getState) => {
  const state = getState()
  const activeStory = state.stories.active

  if (activeStory) { // we should only be setting messages if there is an active story
  	let messages = firebase.database().ref(`messages/${activeStory}`) // query the database only for messages from the active story

    messages.on('value', function(snapshot){
      // if there are no messages available in the story, or no story is selected, clear the messages state
      if (!snapshot.val()) {
        clearMessages() // clear the messages in the store
        return
      };

      // if there are messages
      const messages = helpers.hashToArray(snapshot.val()) // convert our hash into an array of messages
      const sortedMessages = helpers.sortAndGroupBubbles(messages) // and pass our array to be sorted into groups based on the user who posted the message
      
      // any time we click into a story, we can update the message count simultaneously
      const story = firebase.database().ref(`stories/${activeStory}`) // 
      story.update({message_count: snapshot.numChildren()})
      
      // then set our store with our sorted and grouped messages
      dispatch({
  	  	type: 'SET_MESSAGES',
  	  	messages: sortedMessages
  	  })
    });
  }
}

export const sendMessage = (user, story, message) => (dispatch) => {
  let newMessageRef = firebase.database().ref().child(`messages/${story}`).push();
  const key = newMessageRef.key
  const autolinker = new Autolinker();
  let urls = autolinker.parse(message)
  let messageData = {
    id: key,
    userId: user.uid,
    userDisplayName: user.displayName,
    timestamp: firebase.database.ServerValue.TIMESTAMP,
    message: message,
    storyId: story,
    meta: {}
  }
  newMessageRef.set(messageData, function(e){
    console.log('error: ', e)
  });
  
  if(Array.from(urls).length){
    fetch('https://metacheck.now.sh:443/',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({message: message})
      }
    ).then(function(response){
      return response.json()
    }).then(function(data){
      messageData.meta = data;
      newMessageRef.update(messageData);
    })
  }
}

export default {
  setMessages,
  sendMessage
}
