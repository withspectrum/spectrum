import * as firebase from 'firebase';
import helpers from '../helpers';
import fetch from 'whatwg-fetch-importable';
import Autolinker from 'autolinker';

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

clearMessages
Force the messages to be cleared. I'm not sure this is the best way to handle this, but in the meantime it can be used for:
- clearing messages when a story is deleted
- clearing messages when frequencies are changed
- clearing messages when caching or localstorage is out of sync

*
\*------------------------------------------------------------*/
export const clearMessages = () => ({ type: 'CLEAR_MESSAGES' });

/*------------------------------------------------------------\*
*

setMessages
Fetches all messages for the active story.

*
\*------------------------------------------------------------*/
export const setMessages = () => (dispatch, getState) => {
  let { stories, database } = setup(getState());
  let activeStory = stories.active;

  // if an active story is set in redux we'll populate the messages
  if (activeStory) {
    let messagesRef = database.ref(`messages/${activeStory}`);

    // get all the messages for this story
    messagesRef.on(
      'value',
      snapshot => {
        // if there are no messages available in the story clear the messages state
        // the main use case here is a person switching from an existing story to a newly created story, which will swap the IDs of activeStory, but no messages will exist yet
        if (!snapshot.val()) {
          console.log('No messages for this story.');
          dispatch(clearMessages()); // clear the messages in the store
          return;
        }

        // convert the messages into an array
        let messagesArray = helpers.hashToArray(snapshot.val());
        // and pass our array to be sorted into groups based on the user who posted the message
        let sortedMessages = helpers.sortAndGroupBubbles(messagesArray);
        // send the sorted messages to redux
        dispatch({
          type: 'SET_MESSAGES',
          messages: sortedMessages,
        });

        // update the story's message count to the latest number of messages
        let story = database.ref(`stories/${activeStory}`);
        story.update({
          message_count: snapshot.numChildren(),
        });
      },
      err => {
        // if there was an error fetching messages
        if (err) console.log('Error settings messages: ', err);
      },
    );
  } else {
    // if there's no active story, lets flush the messages
    dispatch(clearMessages());
  }
};

/*------------------------------------------------------------\*
*

sendMessages
Takes a message of any type, creates a new message, and saves it with relation to the current active story and current authed user.

Note + TODO: we'll do backend checks on Firebase Rules to ensure that the user has permissions to write to this node

*
\*------------------------------------------------------------*/
export const sendMessage = message => (dispatch, getState) => {
  let { user, stories, database } = setup(getState());
  let activeStory = stories.active;

  console.log('sendMessage() ', message, user, activeStory)

  // create a new child in the messages for this story
  let newMessageRef = database.ref().child(`messages/${activeStory}`).push();
  // store the key to be used for the metadata
  let newMessageKey = newMessageRef.key;

  // create an autolinker to parse the message body for urls to convert them into hyperlinks
  let autolinker = new Autolinker();
  let urls = autolinker.parse(message);

  // create a message object to story type
  // TODO: Add checks for message type so we can know if this is an image, url, embed, audio, or just plain text (etc)
  let messageObj = {
    type: 'text',
    content: message,
  };

  // the metadata to save for each message
  let messageData = {
    id: newMessageKey,
    userId: user.uid,
    timestamp: firebase.database.ServerValue.TIMESTAMP,
    message: messageObj,
    storyId: activeStory,
    meta: {},
  };

  // save our new message
  newMessageRef.set(messageData, err => {
    if (err) console.log('Error posting a new message: ', err);
  });

  // if our url checker returns data, parse the url for metadata to store along with the message (for link unfurling)
  if (Array.from(urls).length) {
    fetch('https://metacheck.now.sh:443/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: message }),
    })
      .then(function(response) {
        return response.json();
      })
      .then(function(data) {
        messageData.meta = data;
        newMessageRef.update(messageData);
      });
  }
};

export default {
  setMessages,
  sendMessage,
};
