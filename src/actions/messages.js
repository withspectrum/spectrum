import {
  createMessage,
  createPrivateMessage,
  getMessageKey,
  getPrivateMessageKey,
  createReaction,
  deleteReaction,
} from '../db/messages';
import { createNewMessageGroup } from '../db/messageGroups';
import { track } from '../EventTracker';
import { getCurrentFrequency } from '../helpers/frequencies';

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

    const key = getMessageKey();

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
      frequency,
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

    const key = getPrivateMessageKey();

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
      user,
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

      const key = getPrivateMessageKey();

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
        user,
        message,
        key,
      });
    });
  }
};

export const addReaction = messageId => (dispatch, getState) => {
  const { user: { uid } } = getState();

  track('reaction', 'created', null);

  createReaction({
    messageId,
    uid,
  }).then(() => {
    dispatch({
      type: 'ADD_REACTION',
      messageId,
      uid,
    });
  });
};

export const removeReaction = messageId => (dispatch, getState) => {
  const { user: { uid } } = getState();

  track('reaction', 'removed', null);

  deleteReaction({
    messageId,
    uid,
  }).then(() => {
    dispatch({
      type: 'REMOVE_REACTION',
      messageId,
      uid,
    });
  });
};
