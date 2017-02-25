import { hashToArray, sortAndGroupBubbles } from '../helpers/utils';
import fetch from 'whatwg-fetch-importable';
import Autolinker from 'autolinker';
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

  // create an autolinker to parse the message body for urls to convert them into hyperlinks
  const autolinker = new Autolinker();
  const urls = autolinker.parse(message);

  createMessage({
    storyId,
    frequencyId,
    userId: user.uid,
    message,
  }).then(message => {
    dispatch({
      type: 'ADD_MESSAGE',
      message,
    });
  });
};
