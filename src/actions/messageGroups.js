//@flow

import history from '../helpers/history';
import { track } from '../EventTracker';
import { arrayToHash } from '../helpers/utils';
import {
  getMessageGroup,
  listenToMessageGroup,
  stopListening,
} from '../db/messageGroups';
import { getMessagesFromLocation, getMessage } from '../db/messages';
import { getUserInfo } from '../db/users';
import { throwError } from './errors';
import {
  CLEAR_ACTIVE_MESSAGE_GROUP,
  SET_ACTIVE_MESSAGE_GROUP,
  ADD_MESSAGE_GROUP,
} from './actionTypes';

let listener;
export const setActiveMessageGroup = (messageGroupId: ?string): Object => (
  dispatch: Function,
  getState: Function,
) => {
  dispatch({
    type: SET_ACTIVE_MESSAGE_GROUP,
    messageGroupId,
  });

  // if a user navigates to /messages, clear the active messageGroup and return
  if (!messageGroupId) return {};

  track('direct message thread', 'viewed', null);

  getMessagesFromLocation('message_groups', messageGroupId)
    .then(messages => {
      if (!messages) {
        dispatch({ type: 'STOP_LOADING' });
      } else {
        dispatch({
          type: 'ADD_MESSAGES',
          messages,
        });
      }
    })
    .catch(err => {
      dispatch(throwError(err));
      dispatch({ type: 'STOP_LOADING' });
    });

  if (listener) stopListening(listener);
  listener = listenToMessageGroup(messageGroupId, messageGroup => {
    if (!messageGroup || !messageGroup.messages) return;
    const messages = Object.keys(messageGroup.messages);

    Promise
      .all(messages.map(message => getMessage('messages_private', message)))
      .then(messages => {
        dispatch({
          type: 'ADD_MESSAGES',
          messages,
        });
      });
  });
};

export const addMessageGroup = (group: Object) => (dispatch: Function) => {
  getMessageGroup(group.id)
    .then(messageGroup => {
      const users = Object.keys(messageGroup.users);
      return Promise.all([
        messageGroup,
        Promise.all(users.map(user => getUserInfo(user))),
      ]);
    })
    .then(data => {
      if (!data) return;
      const [messageGroup, users] = data;
      dispatch({
        type: ADD_MESSAGE_GROUP,
        messageGroup,
        users: arrayToHash(users, 'uid'),
      });
    });
};
