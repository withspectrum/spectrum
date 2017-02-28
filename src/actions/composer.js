import { track } from '../EventTracker';
/*------------------------------------------------------------\*
*

toggleComposer
Right now there isn't much state to manage on the composer, but we do store
an open/closed boolean in redux so that as a user navigates around, or refreshes the page,
we'll be able to persist the UI

*
\*------------------------------------------------------------*/
export const toggleComposer = () => {
  track('composer', 'toggled', null);

  return {
    type: 'TOGGLE_COMPOSER_OPEN',
  };
};

export const updateTitle = title => ({
  type: 'UPDATE_TITLE',
  title,
});

export const updateBody = body => ({
  type: 'UPDATE_BODY',
  body,
});
