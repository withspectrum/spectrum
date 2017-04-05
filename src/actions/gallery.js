import { track } from '../EventTracker';
import { getFileUrlFromStory, getMediaFromStory } from '../db/stories';
import { throwError } from './errors';

/**
 * Open the gallery at a certain image
 */
export const openGallery = (e, story) => (dispatch, getState) => {
  dispatch({ type: 'LOADING' });
  const targetImg = e.target.src.toString();
  const activeStory = story || getState().stories.active;

  track('gallery', 'opened', null);

  getMediaFromStory(activeStory).then(media => {
    const filenames = Object.keys(media).map(item => media[item].fileName);
    // Find the index of the image that was clicked on
    const index = filenames.findIndex(
      filename => targetImg.indexOf(encodeURI(filename)) > -1,
    );

    Promise.all(filenames.map(file => getFileUrlFromStory(file, activeStory)))
      .then(fileUrls => {
        dispatch({
          type: 'SHOW_GALLERY',
          isOpen: true,
          media: fileUrls,
          index: index || 0,
        });
      })
      .catch(err => {
        dispatch(throwError(err));
      });
  });
};

export const closeGallery = () => {
  track('gallery', 'closed', null);

  return {
    type: 'HIDE_GALLERY',
  };
};
