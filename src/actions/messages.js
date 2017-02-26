import { createMessage } from '../db/messages';

/**
 * Send a message
 */
export const sendMessage = message => (dispatch, getState) => {
  const { user, stories } = getState();
  const storyId = stories.active;
  const frequencyId = stories.stories.find(
    story => story.id === stories.active,
  ).frequencyId;

  createMessage({
    storyId,
    frequencyId,
    userId: user.uid,
    message,
  });
};
