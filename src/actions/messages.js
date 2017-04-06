import {
  createMessage,
  createPrivateMessage,
  getMessageKey,
  createReaction,
  deleteReaction,
} from '../db/messages';
import { createNewMessageGroup } from '../db/messageGroups';
import { track } from '../EventTracker';
import { getCurrentFrequency } from '../helpers/frequencies';
import history from '../helpers/history';
import { throwError } from './errors';

/**
 * Send a message
 */
export const sendMessage = message => (dispatch, getState) => {
  const {
    user,
    stories,
    frequencies: { frequencies },
    messageGroups,
    messageComposer,
  } = getState();
  const storyId = stories.active;
  const messageGroupId = messageGroups.active;

  if (storyId) {
    // if the user is sending this message from a story
    const frequencyId = stories.stories.find(
      story => story.id === stories.active,
    ).frequencyId;
    const frequency = getCurrentFrequency(frequencyId, frequencies);

    track(`${message.type} message`, 'sent', null);

    const key = getMessageKey('messages');

    // Show message locally before persisting to server
    dispatch({
      type: 'SEND_MESSAGE',
      message: {
        userId: user.uid,
        timestamp: Date.now(),
        frequencyId: frequency.id,
        storyId: storyId,
        id: key,
        message,
        persisted: false,
      },
    });

    createMessage({
      storyId,
      frequencyId: frequency.id,
      user,
      message,
      key,
    });
  }

  if (messageGroupId) {
    // if the user is in a private message group
    const messageGroup = messageGroups.messageGroups.find(
      messageGroup => messageGroup.id === messageGroupId,
    );

    track(`messageGroup ${message.type} message`, 'sent', null);

    const key = getMessageKey('messages_private');

    // Show message locally before persisting to server
    dispatch({
      type: 'SEND_MESSAGE',
      message: {
        userId: user.uid,
        timestamp: Date.now(),
        messageGroupId: messageGroup.id,
        id: key,
        message,
        persisted: false,
      },
    });

    createPrivateMessage({
      messageGroupId,
      userId: user.uid,
      message,
      key,
    });
  }

  if (!storyId && !messageGroupId) {
    // if there is neither a story or message, assume the user is messaging another
    // user for the first time
    const recipient = messageComposer.recipient.uid;
    createNewMessageGroup(user.uid, recipient).then(newGroupKey => {
      track(`messageGroup ${message.type} message`, 'sent', null);

      const key = getMessageKey('messages_private');

      // Show message locally before persisting to server
      dispatch({
        type: 'SEND_MESSAGE',
        message: {
          userId: user.uid,
          timestamp: Date.now(),
          messageGroupId: newGroupKey,
          id: key,
          message,
          persisted: false,
        },
      });

      createPrivateMessage({
        messageGroupId: newGroupKey,
        userId: user.uid,
        message,
        key,
      }).then(() => {
        history.push(`/messages/${newGroupKey}`);

        dispatch({
          type: 'SET_ACTIVE_MESSAGE_GROUP',
          messageGroupId: newGroupKey,
        });
      });
    });
  }
};

export const addReaction = messageId => (dispatch, getState) => {
  const { user: { uid }, stories, messageGroups } = getState();
  const activeStory = stories.active;
  const activeMessageGroup = messageGroups.active;
  const type = activeStory
    ? 'messages'
    : activeMessageGroup ? 'messages_private' : 'messages';

  track('reaction', 'created', null);

  createReaction({
    type,
    messageId,
    uid,
  })
    .then(() => {
      dispatch({
        type: 'ADD_REACTION',
        messageId,
        uid,
      });
    })
    .catch(err => {
      dispatch(throwError(err));
    });
};

export const removeReaction = messageId => (dispatch, getState) => {
  const { user: { uid }, stories, messageGroups } = getState();
  const activeStory = stories.active;
  const activeMessageGroup = messageGroups.active;
  const type = activeStory
    ? 'messages'
    : activeMessageGroup ? 'messages_private' : 'messages';

  track('reaction', 'removed', null);

  deleteReaction({
    type,
    messageId,
    uid,
  })
    .then(() => {
      dispatch({
        type: 'REMOVE_REACTION',
        messageId,
        uid,
      });
    })
    .catch(err => {
      dispatch(throwError(err));
    });
};
