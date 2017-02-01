import * as firebase from 'firebase';
import { hashToArray, sortAndGroupBubbles } from '../helpers/utils'

export const setMessages = (id) => (dispatch, getState) => {
	let messages = firebase.database().ref('messages')

  messages.orderByChild('storyId').equalTo(id).on('value', function(snapshot){
    // if there are no messages available in the story, or no story is selected, clear the messages state
    if (!snapshot.val()) {
      dispatch({
        type: 'SET_MESSAGES',
        messages: []
      })

      return
    };

    const messages = hashToArray(snapshot.val())
    const sortedMessages = sortAndGroupBubbles(messages)
    dispatch({
	  	type: 'SET_MESSAGES',
	  	messages: sortedMessages
	  })
  });
}

export const sendMessage = (user, story, message) => (dispatch) => {
  let newMessageRef = firebase.database().ref().child('messages').push();
  const key = newMessageRef.key
  let messageData = {
    id: key,
    userId: user.uid,
    userDisplayName: user.displayName,
    timestamp: firebase.database.ServerValue.TIMESTAMP,
    message: message,
    storyId: story
  }

  newMessageRef.set(messageData, function(e){
    console.log('error: ', e)
  });
}
