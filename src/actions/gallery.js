import { hashToArray } from '../helpers/utils';
import { track } from '../EventTracker';
import { getFileUrl, getStoryMedia } from '../db/stories';

/**
 * Open the gallery at a certain image
 */
export const openGallery = e => (dispatch, getState) => {
  dispatch({ type: 'LOADING' });
  const targetImg = e.target.src.toString();
  const activeStory = getState().stories.active;

  track('gallery', 'opened', null);

  getStoryMedia(activeStory).then(media => {
    const filenames = Object.keys(media).map(item => media[item].fileName);
    // Find the index of the image that was clicked on
    const index = filenames.findIndex(
      filename => targetImg.indexOf(encodeURI(filename)) > -1,
    );

    Promise.all(filenames.map(file => getFileUrl(file, activeStory)))
      .then(fileUrls => {
        dispatch({
          type: 'SHOW_GALLERY',
          isOpen: true,
          media: fileUrls,
          index: index || 0,
        });
      });
  });
};

export const closeGallery = () => {
  track('gallery', 'closed', null);

  return {
    type: 'HIDE_GALLERY',
  };
};
