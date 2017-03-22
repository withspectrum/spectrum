import {
  createMessage,
  getMessageKey,
  createReaction,
  deleteReaction,
} from '../db/messages';
import { track } from '../EventTracker';
import { getCurrentFrequency } from '../helpers/frequencies';

/**
 * Send a message
 */
export const sendMessage = message => (dispatch, getState) => {
  const { user, stories, frequencies: { frequencies } } = getState();
  const storyId = stories.active;
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
