import * as firebase from 'firebase';
import { hashToArray } from '../helpers/utils'

export const setMessages = (id) => (dispatch, getState) => {
	let messages = firebase.database().ref('messages')

  messages.orderByChild('storyId').equalTo(id).on('value', function(snapshot){
    const messages = hashToArray(snapshot.val())
    dispatch({
	  	type: 'SET_MESSAGES',
	  	messages: messages
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
    console.log(e)
  });
}
