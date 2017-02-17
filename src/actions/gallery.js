/*------------------------------------------------------------\*
*             

Gallery
Accepts an array of URLs which will be parsed and populated in the gallery component.

*
\*------------------------------------------------------------*/
export const showGallery = (media) => (dispatch, getState) => {
	dispatch({
		type: 'SHOW_GALLERY',
		isOpen: true,
		media: media // => array
	})
}

export const hideGallery = () => (dispatch, getState) => {
	dispatch({
		type: 'HIDE_GALLERY'
	})
}

export default {
	showGallery,
	hideGallery
}