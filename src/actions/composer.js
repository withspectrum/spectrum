import { track } from '../helpers/events';

export const openComposer = () => {
  track('composer', 'opened', null);

  return {
    type: 'OPEN_COMPOSER',
  };
};

export const closeComposer = () => ({
  type: 'CLOSE_COMPOSER',
});
