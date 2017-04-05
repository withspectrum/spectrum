import { track } from '../EventTracker';
import { removeImageFromStory } from '../db/stories';
import { apiURL } from '../config/api';

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

export const addMediaList = file => {
  track('composer', 'media uploaded', null);

  return {
    type: 'ADD_MEDIA_LIST',
    file,
  };
};

export const removeImageFromComposer = (image, story) => dispatch => {
  removeImageFromStory({ image, story }).then(() => {
    track('composer', 'media removed', null);

    dispatch({
      type: 'REMOVE_MEDIA_LIST',
      image,
    });
  });
};

export const addLinkPreview = data => dispatch => {
  dispatch({
    type: 'ADD_LINK_PREVIEW',
    linkPreview: {
      data: data.data,
      trueUrl: data.trueUrl,
    },
  });
};

export const removeLinkPreview = () => dispatch => {
  dispatch({
    type: 'REMOVE_LINK_PREVIEW',
  });
};
