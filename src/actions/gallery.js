/*------------------------------------------------------------\*
*

Gallery
Accepts an array of URLs which will be parsed and populated in the gallery component.

*
\*------------------------------------------------------------*/
export const showGallery = media => ({
  type: 'SHOW_GALLERY',
  isOpen: true,
  media: media, // => array
});

export const hideGallery = () => ({
  type: 'HIDE_GALLERY',
});

export default {
  showGallery,
  hideGallery,
};
