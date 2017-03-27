import { track } from '../EventTracker';

/*------------------------------------------------------------\*
*

toggleMessageComposer
Right now there isn't much state to manage on the composer, but we do store
an open/closed boolean in redux so that as a user navigates around, or refreshes the page,
we'll be able to persist the UI

*
\*------------------------------------------------------------*/
export const toggleMessageComposer = () => {
  track('direct message composer', 'toggled', null);

  return {
    type: 'TOGGLE_MESSAGE_COMPOSER_OPEN',
  };
};
