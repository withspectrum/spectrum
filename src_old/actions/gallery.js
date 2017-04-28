//@flow
import { track } from '../EventTracker';
import { getFileUrlFromLocation, getMediaFromLocation } from '../db/media';
import { throwError } from './errors';

/**
 * Open the gallery at a certain image
 */
export const openGallery = (e, key) => (dispatch, getState) => {
  dispatch({ type: 'LOADING' });
  const targetImg = e.target.src.toString();
  const activeStory = key || getState().stories.active;
  const activeMessageGroup = key || getState().messageGroups.active;

  const location = activeStory
    ? 'stories'
    : activeMessageGroup ? 'message_groups' : null;
  const key = activeStory || activeMessageGroup;

  track('gallery', 'opened', null);

  getMediaFromLocation(location, key).then(media => {
    const filenames = Object.keys(media).map(item => media[item].fileName);
    // Find the index of the image that was clicked on
    const index = filenames.findIndex(
      filename => targetImg.indexOf(encodeURI(filename)) > -1
    );

    Promise.all(
      filenames.map(fileName => getFileUrlFromLocation(fileName, location, key))
    )
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
