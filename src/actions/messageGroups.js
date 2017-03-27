import history from '../helpers/history';
import { track } from '../EventTracker';
import { arrayToHash } from '../helpers/utils';
import {
  getMessageGroup,
  listenToMessageGroup,
  stopListening,
} from '../db/messageGroups';
import { getPrivateMessages, getPrivateMessage } from '../db/messages';
import { getUserInfo } from '../db/users';

let listener;
export const setActiveMessageGroup = messageGroupId => (dispatch, getState) => {
  if (!messageGroupId) {
    dispatch({
      type: 'CLEAR_ACTIVE_MESSAGE_GROUP',
    });

    return;
  }

  dispatch({
    type: 'SET_ACTIVE_MESSAGE_GROUP',
    messageGroupId,
  });

  track('direct message thread', 'viewed', null);

  getPrivateMessages(messageGroupId)
    .then(messages => {
      if (!messages) {
        dispatch({ type: 'STOP_LOADING' });
      } else {
        return Promise.all([
          messages,
          // Get all the users that sent messages
          Promise.all(messages.map(message => getUserInfo(message.userId))),
        ]);
      }
    })
    .then(data => {
      if (!data) return;
      const [messages, users] = data;
      dispatch({
        type: 'ADD_MESSAGES',
        messages,
        users: arrayToHash(users, 'uid'),
      });
    })
    .catch(err => {
      console.log(err);
      dispatch({ type: 'STOP_LOADING' });
    });

  if (listener) stopListening(listener);
  listener = listenToMessageGroup(messageGroupId, messageGroupId => {
    dispatch({
      type: 'UPDATE_MESSAGE_GROUP',
      messageGroupId,
    });

    if (!messageGroupId || !messageGroupId.messages) return;
    // Get all messages that aren't in the store yet
    const messages = Object.keys(messageGroupId.messages);

    Promise.all(messages.map(message => getPrivateMessage(message)))
      .then(messages => {
        if (!messages) {
          return;
        }
        return Promise.all([
          messages,
          // Get all the users that sent messages
          Promise.all(messages.map(message => getUserInfo(message.userId))),
        ]);
      })
      .then(data => {
        if (!data) return;
        const [messages, users] = data;
        console.log('getting private message users', users);
        dispatch({
          type: 'ADD_MESSAGES',
          messages,
          users: arrayToHash(users, 'uid'),
        });
      });
  });
};
