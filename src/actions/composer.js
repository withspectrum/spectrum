import { track } from '../helpers/events';

export const openComposer = () => {
  track('composer', 'opened', null);

  return {
    type: 'OPEN_COMPOSER',
  };
};

export const closeComposer = (title, body) => ({
  type: 'CLOSE_COMPOSER',
  title: title,
  body: body,
});
