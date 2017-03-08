import { createMessage } from '../db/messages';
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

  track('message', 'sent', null);

  createMessage({
    storyId,
    frequency,
    user,
    message,
  });
};
