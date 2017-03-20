import { createMessage, getMessageKey } from '../db/messages';
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
