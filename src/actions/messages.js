import * as firebase from 'firebase';
import helpers from '../helpers'
import fetch from 'whatwg-fetch-importable'
import Autolinker from 'autolinker'

export const setMessages = (id) => (dispatch, getState) => {
	let messages = firebase.database().ref(`messages/${id}`)

  messages.on('value', function(snapshot){
    // if there are no messages available in the story, or no story is selected, clear the messages state
    if (!snapshot.val()) {
      dispatch({
        type: 'SET_MESSAGES',
        messages: []
      })

      return
    };

    const messages = helpers.hashToArray(snapshot.val())
    const sortedMessages = helpers.sortAndGroupBubbles(messages)
    const story = firebase.database().ref(`stories/${id}`)
    story.update({message_count: snapshot.numChildren()})
    dispatch({
	  	type: 'SET_MESSAGES',
	  	messages: sortedMessages
	  })
  });
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
