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

setMessages
Fetches all messages for the active story.

*
\*------------------------------------------------------------*/
export const setMessages = () => (dispatch, getState) => {
  dispatch({ type: 'LOADING' })

  let { stories, database } = setup(getState());
  let activeStory = stories.active;

  if (!activeStory) return;

  let messagesRef = database.ref(`messages/${activeStory}`);

  // get all the messages for this story
  messagesRef.on(
    'value',
    snapshot => {
      const val = snapshot.val();
      if (!val) {
        dispatch({ type: 'STOP_LOADING' })
        return;
      }
      // convert the messages into an array
      let messagesArray = helpers.hashToArray(val);
      // and pass our array to be sorted into groups based on the user who posted the message
      let sortedMessages = helpers.sortAndGroupBubbles(messagesArray);
      // send the sorted messages to redux
      dispatch({
        type: 'SET_MESSAGES',
        messages: sortedMessages,
        story: activeStory,
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

  // create a new child in the messages for this story
  let newMessageRef = database.ref().child(`messages/${activeStory}`).push();
  // store the key to be used for the metadata
  let newMessageKey = newMessageRef.key;

  // create an autolinker to parse the message body for urls to convert them into hyperlinks
  let autolinker = new Autolinker();
  let urls = autolinker.parse(message);

  // the metadata to save for each message
  let messageData = {
    id: newMessageKey,
    userId: user.uid,
    timestamp: firebase.database.ServerValue.TIMESTAMP,
    message: message,
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
